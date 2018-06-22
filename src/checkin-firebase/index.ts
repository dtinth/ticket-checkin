import { firebase } from '../firebase'
import { saveLog } from '../local-logs'

export function writeCheckinRecord(
  attendeesRef: firebase.database.Reference,
  refCode: string,
  mode: string
) {
  attendeesRef
    .parent!.child('checkins')
    .child(`${refCode}`)
    .transaction(currentData => {
      if (currentData === null) {
        return {
          time: firebase.database.ServerValue.TIMESTAMP,
          mode
        }
      } else {
        return
      }
    })
  saveLog({
    type: 'checkin',
    eventId: attendeesRef.parent!.key,
    refCode,
    mode
  })
}

export interface IAttendee {
  displayName: string
  info?: any
  searchableIndex?: { [k: string]: string }
}
