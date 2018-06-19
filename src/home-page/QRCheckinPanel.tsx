import React, { Fragment, ReactNode } from 'react'
import QrReader from 'react-qr-reader'
import {
  KioskCheckInController,
  KioskViewModel,
  KioskCheckInStatus
} from '../checkin-kiosk'
import { AdminOnly } from '../event-admin'
import { flashError } from '../flash-message'
import { BoxItem, Button, HBox, VBox } from '../ui'
import { Description } from './Description'

export class QRCheckinPanel extends React.Component<
  {},
  { enabled: boolean; facingMode: 'user' | 'environment' }
> {
  state = {
    enabled: false,
    facingMode: 'user' as 'user'
  }
  handleError = e => {
    console.error(e)
    flashError(`Cannot scan QR: ${e}`)
  }
  onEnableUser = e => {
    this.setState({ enabled: true, facingMode: 'user' })
  }
  onEnableEnvironment = e => {
    this.setState({ enabled: true, facingMode: 'environment' })
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
        <AdminOnly>
          {() => (
            <Fragment>
              <BoxItem>
                <HBox wrap>
                  <Button disabled={enabled} onClick={this.onEnableUser}>
                    Front camera
                  </Button>
                  <Button disabled={enabled} onClick={this.onEnableEnvironment}>
                    Back camera
                  </Button>
                  <Button disabled={!enabled} onClick={this.onDisable}>
                    Disable
                  </Button>
                </HBox>
              </BoxItem>
              <BoxItem>{enabled && this.renderQRReader()}</BoxItem>
            </Fragment>
          )}
        </AdminOnly>
      </VBox>
    )
  }
  renderQRReader() {
    return (
      <div style={{ maxWidth: '360px', margin: '0 auto' }}>
        <KioskCheckInController>
          {state => (
            <Fragment>
              <QrReader
                delay={200}
                onError={this.handleError}
                onScan={code => code && state.handleRefCode(code)}
                facingMode={this.state.facingMode}
              />
              {this.renderResult(state)}
            </Fragment>
          )}
        </KioskCheckInController>
      </div>
    )
  }
  renderResult(state: KioskViewModel): ReactNode {
    const msg = (color, text) => (
      <div
        style={{
          background: color,
          padding: 10,
          textShadow: '1px 1px 0 rgba(0,0,0,0.3)'
        }}
      >
        {text}
      </div>
    )
    if (state.status === KioskCheckInStatus.Initializing) {
      return msg('#9784D5', 'Initializing')
    }
    if (state.status === KioskCheckInStatus.InitializationError) {
      return msg('#D58485', `Initialization error: ${state.error}`)
    }
    if (state.status === KioskCheckInStatus.Ready) {
      return msg('#84A4D5', `Ready to scan`)
    }
    if (state.status === KioskCheckInStatus.Success) {
      return msg(
        '#43C051',
        <span>
          Scanned:<br />
          <strong>{state.attendee!.displayName}</strong>
        </span>
      )
    }
    if (state.status === KioskCheckInStatus.NotFound) {
      return msg('#D58485', `QR code not recognized`)
    }
    throw new Error('!')
  }
}
