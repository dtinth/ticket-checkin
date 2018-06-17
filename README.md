# ticket-checkin

Ticket check-in system, for events

## Features

- **Multiple check-in modes:**

  <table>
    <tr>
      <th>Check-in mode</th>
      <th>Pros</th>
      <th>Cons</th>
    </tr>
    <tr>
      <td>
        <strong>Self check-in</strong><br />
        Attendee checks in by entering ticket refCode + time-based OTP.
      </td>
      <td>
        ◆ No need to wait in line.<br />
        ◆ Self-service.<br />
        ◆ Attendee gets a personal greeting.
      </td>
      <td>
        ◆ Unfamiliar method.<br />
        ◆ Requires attendee to have a mobile device to check in.
      </td>
    </tr>
    <tr>
      <td>
        <strong>Kiosk check-in</strong><br />
        Attendee presents ticket QR code to check in at the kiosk.
      </td>
      <td>
        ◆ Works with printed tickets.<br />
        ◆ Self-service.<br />
        ◆ Attendee gets a personal greeting.
      </td>
      <td>
        ◆ Have to wait in line to use the kiosk.
      </td>
    </tr>
    <tr>
      <td>
        <strong>Staff check-in</strong><br />
        Staff uses a mobile PWA to check attendees in using QR code.
      </td>
      <td>
        ◆ No need to wait in line.<br />
        ◆ Works with printed tickets.
      </td>
      <td>
        ◆ Needs manual work by staff.<br />
        ◆ Have to wait for an available staff.<br />
        ◆ Attendees don’t get a personal greeting.
      </td>
    </tr>
    <tr>
      <td>
        <strong>Manual check-in</strong><br />
        A staff checks attendee in by searching manually. Used as a last resort.
      </td>
      <td>
        ◆ For when user has lost their ticket but can verify their identity.
      </td>
      <td>
        ◆ Needs manual work by staff.<br />
        ◆ Takes the most time.
      </td>
    </tr>
  </table>

- **Swag fulfillment:**

  - We printed high-quality name tags with attendees’ name ahead of time. After
    an attendee checks in, we want them to see their name tag already placed on
    the table.

  - When an attendee checks in, their information will be placed on a queue. A
    fulfillment staff will rotate to take orders from the queue. This is kinda
    like how Starbucks.

## Data model

Just read the [bolt](./database.rules.bolt) file.
