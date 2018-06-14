import React, { Fragment } from 'react'
import { Panel } from '../ui'
import { AdminOnly } from '../event-admin'
export class AttendeeTotpPanel extends React.Component {
  render() {
    return (
      <Panel title="Attendee TOTP">
        <AdminOnly>
          {() => (
            <Fragment>
              TODO: This panel generates a TOTP for attendees.
            </Fragment>
          )}
        </AdminOnly>
      </Panel>
    )
  }
}
