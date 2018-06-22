import { firebase } from '../firebase'

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
  localStorage.setItem(
    `ticket-checkin:${refCode}`,
    JSON.stringify({
      mode,
      time: Date.now()
    })
  )
}

export interface IAttendee {
  displayName: string
  info?: any
  searchableIndex?: { [k: string]: string }
}
