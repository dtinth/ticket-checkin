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
import { InternalPageLayout } from '../ui'

const panels = [
  { title: 'Navigation', component: NavigationPanel, side: 'left' },
  { title: 'Authentication', component: AuthenticationPanel, side: 'left' },
  { title: 'QR checkin', component: KioskCheckInPanel, side: 'right' },
  { title: 'Manual checkin', component: ManualCheckinPanel, side: 'right' },
  { title: 'Self checkin', component: SelfCheckinPanel, side: 'right' },
  { title: 'Attendee TOTP', component: AttendeeTotpPanel, side: 'right' },
  { title: 'Code scanner', component: CodeScannerPanel, side: 'right' },
  { title: 'Information', component: InfoPanel, side: 'left' }
]

export class HomePage extends React.Component<{ match: any }> {
  render() {
    return (
      <eventContext.Provider value={this.props.match.params.eventId}>
        <InternalPageLayout>
          <DesktopHomePanel />
        </InternalPageLayout>
      </eventContext.Provider>
    )
  }
}

class DesktopHomePanel extends React.Component {
  render() {
    const column = { flex: '1 1 500px' }
    const item = { margin: 10 }
    const renderPanels = side =>
      panels
        .filter(p => p.side === side)
        .map(({ component: PanelComponent }, i) => (
          <div style={item} key={i}>
            <PanelComponent />
          </div>
        ))
    return (
      <div>
        <h1>ticket-checkin</h1>
        <p>
          This page provides all the available functionality in the{' '}
          <strong>ticket-checkin</strong> application.
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', margin: -10 }}>
          <div style={column}>{renderPanels('left')}</div>
          <div style={column}>{renderPanels('right')}</div>
        </div>
      </div>
    )
  }
}
