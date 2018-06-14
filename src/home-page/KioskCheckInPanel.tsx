import React, { Fragment } from 'react'
import QrReader from 'react-qr-reader'
import { Panel, VBox, HBox, Button } from '../ui'
import { flashError } from '../flash-message'
import { KioskCheckInController } from '../checkin-kiosk'
import { inspect } from 'util'
import { Description } from './Description'
import { AdminOnly } from '../event-admin'

export class KioskCheckInPanel extends React.Component<
  {},
  { enabled: boolean }
> {
  state = {
    enabled: false
  }
  handleError = e => {
    console.error(e)
    flashError(`Cannot scan QR: ${e}`)
  }
  onEnable = e => {
    this.setState({ enabled: true })
  }
  onDisable = e => {
    this.setState({ enabled: false })
  }
  render() {
    const { enabled } = this.state
    return (
      <Panel title="Kiosk check-in">
        <VBox>
          <Description>
            The <strong>kiosk check-in</strong> method allows attendees to check
            in by showing their QR code to the check-in kiosk.
          </Description>
          <AdminOnly>
            {() => (
              <Fragment>
                <HBox>
                  <Button disabled={enabled} onClick={this.onEnable}>
                    Enable
                  </Button>
                  <Button disabled={!enabled} onClick={this.onDisable}>
                    Disable
                  </Button>
                </HBox>
                {enabled && this.renderQRReader()}
              </Fragment>
            )}
          </AdminOnly>
        </VBox>
      </Panel>
    )
  }
  renderQRReader() {
    return (
      <div style={{ maxWidth: '256px' }}>
        <KioskCheckInController>
          {state => (
            <VBox>
              <RenderLater>
                <QrReader
                  delay={200}
                  onError={this.handleError}
                  onScan={code => code && state.handleRefCode(code)}
                  facingMode="user"
                />
              </RenderLater>
              <div>
                <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
                  {inspect(state)}
                </pre>
              </div>
            </VBox>
          )}
        </KioskCheckInController>
      </div>
    )
  }
}

class RenderLater extends React.Component {
  state = {
    ready: false
  }
  componentDidMount() {
    setTimeout(() => {
      this.setState({ ready: true })
    })
  }
  render() {
    return this.state.ready ? this.props.children : null
  }
}
