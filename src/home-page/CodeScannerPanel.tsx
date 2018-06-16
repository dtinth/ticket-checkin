import React from 'react'
import QrReader from 'react-qr-reader'
import { flashError, flashSuccess } from '../flash-message'
import { Button, HBox, VBox } from '../ui'
import { Description } from './Description'

export class CodeScannerPanel extends React.Component<
  {},
  { enabled: boolean }
> {
  state = {
    enabled: false
  }
  handleError = e => {
    flashError(`Cannot scan QR: ${e}`)
  }
  handleScan = c => {
    if (!c) {
      return
    }
    flashSuccess(`Scanned QR code: ${c}`)
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
        <Description>
          This panel exists for the purpose of simply testing the QR code reader
          :)
        </Description>
        <HBox wrap>
          <Button disabled={enabled} onClick={this.onEnable}>
            Enable QR code reader
          </Button>
          <Button disabled={!enabled} onClick={this.onDisable}>
            Disable QR code reader
          </Button>
        </HBox>
        {enabled && this.renderQRReader()}
      </VBox>
    )
  }
  renderQRReader() {
    return (
      <div style={{ maxWidth: '256px' }}>
        <QrReader
          delay={200}
          onError={this.handleError}
          onScan={this.handleScan}
          facingMode="user"
        />
      </div>
    )
  }
}
