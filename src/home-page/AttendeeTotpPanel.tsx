import React from 'react'
import { Panel, VBox } from '../ui'
import { AdminOnly } from '../event-admin'
import { EventData, unwrapData } from '../event-data'
import { authenticator } from '../totp'
import { Description } from './Description'
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
              <EventData toDataRef={r => r.child('keys').child('attendee')}>
                {state =>
                  unwrapData(state, key => this.renderTotp(key), 'TOTP key')
                }
              </EventData>
            )}
          </AdminOnly>
        </VBox>
      </Panel>
    )
  }
  renderTotp(key: string) {
    return (
      <div
        style={{
          textAlign: 'center',
          fontSize: '2em',
          letterSpacing: '0.5ex'
        }}
      >
        <Totp totpKey={key} />
      </div>
    )
  }
}

class Totp extends React.Component<{ totpKey: string }> {
  interval: number
  render() {
    return authenticator.generate(this.props.totpKey)
  }
  componentDidMount() {
    this.interval = window.setInterval(() => this.forceUpdate(), 2500)
  }
  componentWillUnmount() {
    window.clearInterval(this.interval)
  }
}
