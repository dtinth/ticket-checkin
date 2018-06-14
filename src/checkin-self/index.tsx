import axios from 'axios'

interface CheckInError {
  error: 'ETOKEN' | 'EREF'
}

interface CheckInSuccess {
  checkIn: {
    time: number
    mode: string
  }
  attendee: {
    displayName: string
    info: any
  }
}

export async function checkIn(refCode: string, totp: string, eventId: string) {
  const response = await axios.post(
    'https://us-central1-reactbkk3-tickets-checkin.cloudfunctions.net/checkIn',
    {
      refCode: `${refCode}`.toUpperCase(),
      totp: totp,
      eventId: eventId
    }
  )
  return response.data as CheckInError | CheckInSuccess
}
