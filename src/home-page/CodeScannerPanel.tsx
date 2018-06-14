import React from 'react'
import QrReader from 'react-qr-reader'
import { Panel, VBox, HBox, Button } from '../ui'
import { flashError, flashSuccess } from '../flash-message'

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
      <Panel title="Code scanner">
        <VBox>
          <HBox>
            <Button disabled={enabled} onClick={this.onEnable}>
              Enable
            </Button>
            <Button disabled={!enabled} onClick={this.onDisable}>
              Disable
            </Button>
          </HBox>
          {enabled && this.renderQRReader()}
        </VBox>
      </Panel>
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
