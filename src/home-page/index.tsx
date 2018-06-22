import React from 'react'
import { Link } from 'react-router-dom'
import { eventContext } from '../event-context'
import { InternalPageLayout, Panel } from '../ui'
import { AttendeeTotpPanel } from './AttendeeTotpPanel'
import { AuthenticationPanel } from './AuthenticationPanel'
import { CodeScannerPanel } from './CodeScannerPanel'
import { InfoPanel } from './InfoPanel'
import { ManualCheckinPanel } from './ManualCheckinPanel'
import { NavigationPanel } from './NavigationPanel'
import { QRCheckinPanel } from './QRCheckinPanel'
import { SelfCheckinPanel } from './SelfCheckinPanel'
import { FirebaseStatusIndicator } from '../firebase-status'

interface IControlPanel {
  title: string
  component: React.ComponentClass
  side: 'left' | 'right'
}

const panels: { [k: string]: IControlPanel } = {
  navigation: {
    title: 'Navigation',
    component: NavigationPanel,
    side: 'left'
  },
  authentication: {
    title: 'Authentication',
    component: AuthenticationPanel,
    side: 'left'
  },
  qr: {
    title: 'QR checkin',
    component: QRCheckinPanel,
    side: 'right'
  },
  manual: {
    title: 'Manual checkin',
    component: ManualCheckinPanel,
    side: 'right'
  },
  self: {
    title: 'Self checkin',
    component: SelfCheckinPanel,
    side: 'right'
  },
  totp: {
    title: 'Attendee TOTP',
    component: AttendeeTotpPanel,
    side: 'right'
  },
  qrtest: {
    title: 'Code scanner',
    component: CodeScannerPanel,
    side: 'right'
  },
  information: {
    title: 'Information',
    component: InfoPanel,
    side: 'left'
  }
}

export class HomePage extends React.Component<{ match: any }> {
  timeout: number
  state = { mobile: true }
  checkViewport = () => {
    const mobile = window.innerWidth < 768
    if (mobile !== this.state.mobile) {
      this.setState({ mobile })
    }
  }
  componentDidMount() {
    this.timeout = window.setTimeout(this.checkViewport)
    window.addEventListener('resize', this.checkViewport)
  }
  componentWillUnmount() {
    window.clearTimeout(this.timeout)
    window.removeEventListener('resize', this.checkViewport)
  }
  render() {
    return (
      <eventContext.Provider value={this.props.match.params.eventId}>
        {this.renderContent()}
        <FirebaseStatusIndicator />
      </eventContext.Provider>
    )
  }
  renderContent() {
    const activePanelKey = this.props.match.params.activePanel
    if (this.state.mobile || activePanelKey) {
      return <MobileControlPanel activePanel={activePanelKey} />
    }
    return <DesktopControlPanel />
  }
}

class DesktopControlPanel extends React.Component {
  render() {
    const column = { flex: '1 1 500px' }
    const item = { margin: 10 }
    const renderPanels = side =>
      Object.keys(panels)
        .map(k => panels[k])
        .filter(p => p.side === side)
        .map(({ component: PanelComponent, title }, i) => (
          <div style={item} key={i}>
            <Panel title={title}>
              <PanelComponent />
            </Panel>
          </div>
        ))
    return (
      <InternalPageLayout>
        <h1>ticket-checkin</h1>
        <p>
          This page provides all the available functionality in the{' '}
          <strong>ticket-checkin</strong> application.
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', margin: -10 }}>
          <div style={column}>{renderPanels('left')}</div>
          <div style={column}>{renderPanels('right')}</div>
        </div>
      </InternalPageLayout>
    )
  }
}

class MobileControlPanel extends React.Component<{ activePanel?: string }> {
  render() {
    const currentPanel = this.props.activePanel
      ? panels[this.props.activePanel]
      : null
    const Component = currentPanel ? currentPanel.component : MobileHome
    return (
      <div>
        <div style={{ background: 'black', textAlign: 'center', padding: 5 }}>
          <eventContext.Consumer>
            {eventId => (
              <Link
                style={{ textDecoration: 'none' }}
                to={`/events/${eventId}`}
              >
                ticket-checkin
              </Link>
            )}
          </eventContext.Consumer>
        </div>
        <InternalPageLayout>
          <Component />
        </InternalPageLayout>
      </div>
    )
  }
}

class MobileHome extends React.Component {
  render() {
    return (
      <eventContext.Consumer>
        {eventId => (
          <ul
            style={{
              margin: 0,
              padding: 0,
              listStyle: 'none',
              textAlign: 'center'
            }}
          >
            {Object.keys(panels).map(k => {
              return (
                <li key={k}>
                  <Link
                    style={{ display: 'block', padding: 10 }}
                    to={`/events/${eventId}/${k}`}
                  >
                    {panels[k].title}
                  </Link>
                </li>
              )
            })}
          </ul>
        )}
      </eventContext.Consumer>
    )
  }
}
