import React from 'react'
import {
  AttendeeTotpController,
  AttendeeTotpViewModel,
  AttendeeTotpStatus
} from '../attendee-totp'
import { AdminOnly } from '../event-admin'
import { ErrorMessage, Loading, VBox } from '../ui'
import { Description } from './Description'
export class AttendeeTotpPanel extends React.Component {
  render() {
    return (
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
    )
  }
  renderContents(state: AttendeeTotpViewModel) {
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
