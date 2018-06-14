import React from 'react'
import { eventContext } from '../event-context'
import { AuthenticationPanel } from './AuthenticationPanel'
import { NavigationPanel } from './NavigationPanel'
import { InfoPanel } from './InfoPanel'
import { CodeScannerPanel } from './CodeScannerPanel'
import { AttendeeTotpPanel } from './AttendeeTotpPanel'
import { SelfCheckinPanel } from './SelfCheckinPanel'
import { ManualCheckinPanel } from './ManualCheckinPanel'
import { KioskCheckInPanel } from './KioskCheckInPanel'

export class HomePage extends React.Component<{ match: any }> {
  render() {
    const column = { flex: '1 1 500px' }
    const item = { margin: 10 }
    return (
      <eventContext.Provider value={this.props.match.params.eventId}>
        <div style={{ margin: '20px' }}>
          <h1>ticket-checkin</h1>
          <div style={{ display: 'flex', flexWrap: 'wrap', margin: -10 }}>
            <div style={column}>
              <div style={item}>
                <NavigationPanel />
              </div>
              <div style={item}>
                <AuthenticationPanel />
              </div>
              <div style={item}>
                <InfoPanel />
              </div>
            </div>
            <div style={column}>
              <div style={item}>
                <CodeScannerPanel />
              </div>
              <div style={item}>
                <AttendeeTotpPanel />
              </div>
              <div style={item}>
                <SelfCheckinPanel />
              </div>
              <div style={item}>
                <ManualCheckinPanel />
              </div>
              <div style={item}>
                <KioskCheckInPanel />
              </div>
            </div>
          </div>
        </div>
      </eventContext.Provider>
    )
  }
}
