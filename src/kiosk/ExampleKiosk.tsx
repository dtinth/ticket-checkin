import React from 'react'
import { AttendeeTotpViewModel, AttendeeTotpStatus } from '../attendee-totp'
import { KioskViewModel, KioskCheckInStatus } from '../checkin-kiosk'
import { kioskContext, KioskContext } from './kioskContext'
import { IAttendee } from '../checkin-firebase'

export class ExampleKiosk extends React.Component {
  render() {
    return <kioskContext.Consumer>{this.renderInContext}</kioskContext.Consumer>
  }
  renderInContext = (ctx: KioskContext) => {
    return (
      <div
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          display: 'flex',
          flexDirection: 'column',
          fontSize: '1.8em'
        }}
      >
        <div>
          <p>You can check in conveniently using one of these methods:</p>
        </div>
        <div style={{ flex: 1, display: 'flex' }}>
          <div style={{ width: '50%' }}>
            <h2>Kiosk check-in</h2>
            <p>You can check in by presenting your QR code.</p>
            <ctx.KioskCheckInProvider>
              {this.renderCheckIn}
            </ctx.KioskCheckInProvider>
          </div>
          <div style={{ width: '50%' }}>
            <h2>Self check-in</h2>
            <ctx.TotpProvider>{this.renderTotp}</ctx.TotpProvider>
          </div>
        </div>
      </div>
    )
  }
  renderCheckIn = (state: KioskViewModel) => {
    const renderSuccess = (attendee: IAttendee) => {
      return (
        <div
          style={{
            position: 'absolute',
            left: '20%',
            top: '30%',
            width: '60%',
            height: '40%',
            background: '#363',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <div style={{ textAlign: 'center', padding: 20 }}>
            <strong>Welcome!</strong>
            <div>{attendee.displayName}</div>
          </div>
        </div>
      )
    }
    const renderNotFound = () => {
      return (
        <div
          style={{
            position: 'absolute',
            left: '20%',
            top: '30%',
            width: '60%',
            height: '40%',
            background: '#633',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <div style={{ textAlign: 'center', padding: 20 }}>
            <strong>Ticket not recognized</strong>
            <br />Please contact a staff for further assistance.
          </div>
        </div>
      )
    }
    return (
      <div style={{ position: 'relative' }}>
        <kioskContext.Consumer>
          {ctx => <ctx.QrCodeReader onScan={state.handleRefCode} />}
        </kioskContext.Consumer>
        {state.status === KioskCheckInStatus.Success &&
          renderSuccess(state.attendee!)}
        {state.status === KioskCheckInStatus.NotFound && renderNotFound()}
      </div>
    )
  }

  renderTotp = (state: AttendeeTotpViewModel) => {
    if (state.status === AttendeeTotpStatus.Initializing) {
      return <p>Initializing TOTP...</p>
    }
    if (state.status === AttendeeTotpStatus.InitializationError) {
      return <p>Error! {`${state.error}`}</p>
    }
    return (
      <div>
        <p>You can check in by yourself, no need to wait in line.</p>
        <ol>
          <li>
            Go to <strong>example.com</strong>
          </li>
          <li>
            Click the <strong>self check-in</strong> button
          </li>
          <li>Enter your ticket reference ID from Event Pop (e.g. ABCDEF)</li>
          <li>
            Enter the following TOTP:
            <span
              style={{
                display: 'block',
                fontSize: '2em',
                letterSpacing: '0.5ex'
              }}
            >
              {state.totp}
            </span>
          </li>
        </ol>
      </div>
    )
  }
}
