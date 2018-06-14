import React from 'react'
import { Panel } from '../ui'
import { AdminOnly } from '../event-admin'
import { EventData, unwrapData } from '../event-data'
import { authenticator } from '../totp'
export class AttendeeTotpPanel extends React.Component {
  render() {
    return (
      <Panel title="Attendee TOTP">
        <AdminOnly>
          {() => (
            <EventData toDataRef={r => r.child('keys').child('attendee')}>
              {state =>
                unwrapData(state, key => this.renderTotp(key), 'TOTP key')
              }
            </EventData>
          )}
        </AdminOnly>
      </Panel>
    )
  }
  renderTotp(key: string) {
    return <Totp totpKey={key} />
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
