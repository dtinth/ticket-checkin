import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import authenticator from 'otplib/authenticator'
import crypto from 'crypto'
import cors from 'cors'
authenticator.options = { crypto, window: 6 }

admin.initializeApp()

export const checkIn = functions.https.onRequest((request, response) => {
  cors()(request, response, async () => {
    try {
      const { eventId, totp, refCode } = request.body
      const eventRef = admin
        .database()
        .ref('events')
        .child(`${eventId}`)
      const key = (await eventRef
        .child('keys')
        .child('attendee')
        .once('value')).val()
      if (!key) {
        throw new Error('WTF? No key is found!!')
      }

      const tokenValid = authenticator.check(`${totp}`, key)
      if (!tokenValid) {
        response.json({
          error: 'ETOKEN'
        })
        return
      }

      const attendee = (await eventRef
        .child('attendees')
        .child(`${refCode}`)
        .once('value')).val()
      if (!attendee) {
        response.json({
          error: 'EREF'
        })
        return
      }

      const checkInRef = eventRef.child('checkins').child(`${refCode}`)
      let checkIn = (await checkInRef.once('value')).val()

      if (checkIn) {
        response.json({ checkIn, attendee })
        return
      }

      await checkInRef.set({
        time: admin.database.ServerValue.TIMESTAMP,
        mode: 'self'
      })
      checkIn = (await checkInRef.once('value')).val()

      response.json({ checkIn, attendee })
    } catch (e) {
      response.status(500).send('WTF?')
      console.error(e)
    }
  })
})

export const staffSignIn = functions.https.onCall((data, context) => {})
