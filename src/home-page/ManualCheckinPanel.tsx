import React from 'react'
import { AdminOnly } from '../event-admin'
import { VBox } from '../ui'
import { Description } from './Description'

export class ManualCheckinPanel extends React.Component {
  render() {
    return (
      <VBox>
        <Description>
          The <strong>manual check-in</strong> method is a last resort, where an
          attendee couldn’t find their ticket. Like check-in counters at
          airports, attendees can check-in by providing their personal
          information that matches the records in the database.
        </Description>
        <AdminOnly>{() => <div>TODO</div>}</AdminOnly>
      </VBox>
    )
  }
}
