import React, { Fragment } from 'react'
import { Panel } from '../ui'
import { AdminOnly } from '../event-admin'

export class ManualCheckinPanel extends React.Component {
  render() {
    return (
      <Panel title="Manual Check-In">
        <AdminOnly>
          {() => (
            <Fragment>
              TODO: This panel allows an administrator to manually check-in an
              attendee.
            </Fragment>
          )}
        </AdminOnly>
      </Panel>
    )
  }
}
