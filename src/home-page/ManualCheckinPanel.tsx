import React from 'react'
import { Panel, VBox } from '../ui'
import { AdminOnly } from '../event-admin'
import { Description } from './Description'

export class ManualCheckinPanel extends React.Component {
  render() {
    return (
      <Panel title="Manual Check-In">
        <VBox>
          <Description>
            The <strong>manual check-in</strong> method is a last resort, where
            an attendee couldn’t find their ticket. Like check-in counters at
            airports, attendees can check-in by providing their personal
            information that matches the records in the database.
          </Description>
          <AdminOnly>{() => <div>TODO</div>}</AdminOnly>
        </VBox>
      </Panel>
    )
  }
}
