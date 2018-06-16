import QrReader from 'react-qr-reader'
import { flashError } from '../flash-message'
import React from 'react'
export class QrCodeReader extends React.Component<{
  onScan: (code: string) => any
}> {
  render() {
    return (
      <QrReader
        delay={200}
        onError={error => flashError(`Error scanning QR code: ${error}`)}
        onScan={code => code && this.props.onScan(code)}
        facingMode="user"
      />
    )
  }
}
