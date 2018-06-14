import axios from 'axios'
export async function checkIn(refCode: string, totp: string, eventId: string) {
  return await axios.post(
    'https://us-central1-reactbkk3-tickets-checkin.cloudfunctions.net/checkIn',
    {
      refCode: refCode,
      totp: totp,
      eventId: eventId
    }
  )
}
