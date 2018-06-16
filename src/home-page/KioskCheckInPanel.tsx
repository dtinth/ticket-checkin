import React, { Fragment } from 'react'
import QrReader from 'react-qr-reader'
import { inspect } from 'util'
import { KioskCheckInController } from '../checkin-kiosk'
import { AdminOnly } from '../event-admin'
import { flashError } from '../flash-message'
import { BoxItem, Button, HBox, VBox } from '../ui'
import { Description } from './Description'

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
      <VBox>
        <BoxItem>
          <Description>
            The <strong>kiosk check-in</strong> method allows attendees to check
            in by showing their QR code to the check-in kiosk.
          </Description>
        </BoxItem>
        <BoxItem>
          <AdminOnly>
            {() => (
              <Fragment>
                <HBox wrap>
                  <Button disabled={enabled} onClick={this.onEnable}>
                    Enable QR code reader
                  </Button>
                  <Button disabled={!enabled} onClick={this.onDisable}>
                    Disable QR code reader
                  </Button>
                </HBox>
                {enabled && this.renderQRReader()}
              </Fragment>
            )}
          </AdminOnly>
        </BoxItem>
      </VBox>
    )
  }
  renderQRReader() {
    return (
      <div style={{ maxWidth: '256px' }}>
        <KioskCheckInController>
          {state => (
            <VBox>
              <QrReader
                delay={200}
                onError={this.handleError}
                onScan={code => code && state.handleRefCode(code)}
                facingMode="user"
              />
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
