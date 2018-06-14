import React from 'react'
import { Panel, VBox, ErrorMessage, Loading } from '../ui'
import { AdminOnly } from '../event-admin'
import { Description } from './Description'
import {
  AttendeeTotpController,
  AttendeeTotpState,
  AttendeeTotpStatus
} from '../attendee-totp'
export class AttendeeTotpPanel extends React.Component {
  render() {
    return (
      <Panel title="Attendee TOTP">
        <VBox>
          <Description>
            Attendees must provide the following TOTP code to perform a
            self-checkin.
          </Description>
          <AdminOnly>
            {() => (
              <AttendeeTotpController>
                {state => this.renderContents(state)}
              </AttendeeTotpController>
            )}
          </AdminOnly>
        </VBox>
      </Panel>
    )
  }
  renderContents(state: AttendeeTotpState) {
    if (state.status === AttendeeTotpStatus.Initializing) {
      return <Loading>Loading TOTP</Loading>
    } else if (state.status === AttendeeTotpStatus.InitializationError) {
      return (
        <ErrorMessage>Cannot initialize TOTP: {`${state.error}`}</ErrorMessage>
      )
    } else {
      return (
        <div
          style={{
            textAlign: 'center',
            fontSize: '2em',
            letterSpacing: '0.5ex'
          }}
        >
          {state.totp}
        </div>
      )
    }
  }
}
