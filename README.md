# ticket-checkin

Ticket check-in system, for events

## Features

- **Multiple check-in modes:**

  - Self check-in: Attendee checks in by ~~sending a POST request to Firebase
    cloud function~~ entering ticket reference ID + time-based OTP.

  - Kiosk check-in: Attendee presents ticket QR code to check in at the kiosk.

  - Staff check-in: Staff uses a mobile PWA to check in attendees.

  - Manual check-in: Staff searches for attendee’s information and checks in
    manually.

- **Swag fulfillment:**

  - We printed high-quality name tags with attendees’ name ahead of time. After
    an attendee checks in, we want them to see their name tag already placed on
    the table.

  - When an attendee checks in, their information will be placed on a queue. A
    fulfillment staff will rotate to take orders from the queue. This is kinda
    like how Starbucks.

## Data model

Just read the [bolt](./database.rules.bolt) file.
