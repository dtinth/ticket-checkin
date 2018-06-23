// @ts-check

const admin = require('firebase-admin')
const serviceAccount = require('./config/service-account.json')
const delay = require('delay')
const log = require('pino')({ prettyPrint: true })

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://reactbkk3-tickets-checkin.firebaseio.com'
})

process.on('unhandledRejection', up => {
  throw up
})

async function main() {
  log.info('Starting job manager...')
  const eventRef = admin
    .database()
    .ref('events')
    .child('reactbkk3')

  const readCheckins = await getReader(eventRef.child('checkins'))
  log.info('Checkins synchronized...')

  const readFulfillment = await getReader(eventRef.child('fulfillment'))
  log.info('Fulfillments synchronized...')

  let lastInfo

  for (;;) {
    try {
      const checkinsSnapshot = readCheckins()
      const fulfillmentSnapshot = readFulfillment()

      const acceptedRefCodes = new Set()
      const acceptingClients = []
      const untendedCheckins = []

      fulfillmentSnapshot.forEach(userSnapshot => {
        userSnapshot.forEach(clientSnapshot => {
          const availableKey = clientSnapshot.child('available').val()
          clientSnapshot.child('jobs').forEach(jobSnapshot => {
            acceptedRefCodes.add(jobSnapshot.child('refCode').val())
            return false
          })
          const acceptingNewJob =
            availableKey &&
            !clientSnapshot
              .child('jobs')
              .child(availableKey)
              .exists()
          if (acceptingNewJob) {
            acceptingClients.push(clientSnapshot)
          }
          return false
        })
        return false
      })
      acceptingClients.sort((a, b) => {
        return a.child('available').val() < b.child('available').val() ? -1 : 1
      })

      checkinsSnapshot.forEach(checkinSnapshot => {
        if (acceptedRefCodes.has(checkinSnapshot.key)) {
          return false
        }
        untendedCheckins.push(checkinSnapshot)
        return false
      })
      untendedCheckins.sort(
        (a, b) => a.child('time').val() - b.child('time').val()
      )

      const info = {
        untended: untendedCheckins.length,
        accepting: acceptingClients.length
      }
      if (!lastInfo || JSON.stringify(lastInfo) !== JSON.stringify(info)) {
        lastInfo = info
        log.info(info, 'Processing queue')
      }

      if (untendedCheckins.length || acceptingClients.length) {
        for (
          let i = 0;
          i < untendedCheckins.length && i < acceptingClients.length;
          i++
        ) {
          const checkinSnapshot = untendedCheckins[i]
          const refCode = checkinSnapshot.key
          const clientSnapshot = acceptingClients[i]
          log.info(
            'Matching attendee %s to client %s',
            refCode,
            clientSnapshot.key
          )
          const attendeeRef = eventRef
            .child('attendees')
            .child(checkinSnapshot.key)
          const attendeeSnapshot = await attendeeRef.once('value')
          const displayName = (attendeeSnapshot.val() || {}).displayName || '??'
          log.info('... attendee’s name: %s', displayName)
          const availableKey = clientSnapshot.child('available').val()
          await clientSnapshot.ref
            .child('jobs')
            .child(availableKey)
            .transaction(old => {
              if (!old) {
                return {
                  time: admin.database.ServerValue.TIMESTAMP,
                  refCode,
                  displayName
                }
              }
              return
            })
        }
      }
    } catch (e) {
      log.error(e)
    }

    await delay(1000)
  }
}

/**
 * @param {import('firebase-admin').database.Reference} ref
 * @returns {Promise<() => import('firebase-admin').database.DataSnapshot>}
 */
function getReader(ref) {
  return new Promise((resolve, reject) => {
    let _value
    let _error
    let _resolved = false
    ref.on(
      'value',
      value => {
        _value = value
        ensureResolved()
      },
      error => {
        _error = error
        reject(error)
      }
    )
    function ensureResolved() {
      if (_resolved) return
      _resolved = true
      resolve(() => {
        if (_error) throw _error
        return _value
      })
    }
  })
}

main()
