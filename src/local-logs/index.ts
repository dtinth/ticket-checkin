import Dexie from 'dexie'
let db

export function saveLog(payload) {
  if (!db) {
    db = new Dexie('ticket-checkin')
    db.version(1).stores({
      logItems: `++id, time`
    })
  }
  return db.logItems.put({ time: Date.now(), payload })
}
