import React, { Fragment } from 'react'
import { Panel } from '../ui'
import { AdminOnly } from '../event-admin'
export class InfoPanel extends React.Component {
  render() {
    return (
      <Panel title="Information">
        <AdminOnly>
          {() => (
            <Fragment>
              TODO: This panel shows information about recently checked-in
              attendees.
            </Fragment>
          )}
        </AdminOnly>
      </Panel>
    )
  }
}
