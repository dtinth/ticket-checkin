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

```yml
events:
  EVENT NAME:
    # Event information (public)
    info:
      title: TITLE

    # Keys used to generate OTP (secret)
    keys:
      # For self-checkin
      attendee: KEY

      # For staff checkin
      staff: KEY

    # Attendee info (private)
    attendees:
      REFCODE:
        info:
          name: 'Name'
          company: 'Company name'
          position: 'Position name'

    # Check-in records
    checkins:
      REFCODE:
        time: TIMESTAMP
        mode: staff / self / kiosk / manual

    # Fulfillment staff
    staff:
      UID:
        # If available for fulfillment, then put a unique ID here
        available: NEXT_ID

        # Fulfillment jobs
        jobs:
          ID:
            time: TIMESTAMP
            refcode: REFCODE
            info:
              name: 'Name'
              company: 'Company name'
              position: 'Position name'
```
