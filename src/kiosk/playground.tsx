import React, { createContext, ReactNode, Fragment } from 'react'
import { AttendeeTotpViewModel, AttendeeTotpStatus } from '../attendee-totp'
import { KioskViewModel, KioskCheckInStatus } from '../checkin-kiosk'
import { flashSuccess } from '../flash-message'
import { KioskContext } from './kioskContext'
import { Button, HBox, VBox } from '../ui'
import { QrCodeReader } from './QrCodeReader'

interface PlaygroundState {
  kioskCheckInStatus: KioskCheckInStatus
}

export const playgroundStateContext = createContext<PlaygroundState>(null!)

export const playgroundKioskContext: KioskContext = {
  TotpProvider: class MockTotpProvider extends React.Component<{
    children: (state: AttendeeTotpViewModel) => ReactNode
  }> {
    render() {
      return this.props.children({
        status: AttendeeTotpStatus.Ready,
        totp: '123456'
      })
    }
  },
  KioskCheckInProvider: class MockKioskCheckInProvider extends React.Component<{
    children: (state: KioskViewModel) => ReactNode
  }> {
    render() {
      return (
        <playgroundStateContext.Consumer>
          {ctx => {
            const handleRefCode = code => {
              flashSuccess(`Scanned code: ${code}`)
            }
            if (ctx.kioskCheckInStatus === KioskCheckInStatus.Success) {
              return this.props.children({
                status: KioskCheckInStatus.Success,
                attendee: {
                  displayName: 'Attendee’s display name',
                  info: {
                    name: 'Attendee’s display name',
                    position: 'Position name',
                    company: 'Company name'
                  }
                },
                handleRefCode
              })
            } else if (ctx.kioskCheckInStatus === KioskCheckInStatus.NotFound) {
              return this.props.children({
                status: KioskCheckInStatus.NotFound,
                handleRefCode
              })
            } else {
              return this.props.children({
                status: KioskCheckInStatus.Ready,
                handleRefCode
              })
            }
          }}
        </playgroundStateContext.Consumer>
      )
    }
  },
  QrCodeReader: class MockQrCodeReader extends React.Component<
    {
      onScan: (code: string) => any
    },
    { real: boolean }
  > {
    state = { real: false }
    render() {
      if (this.state.real) {
        return <QrCodeReader onScan={this.props.onScan} />
      }
      return (
        <div
          style={{
            position: 'relative',
            paddingTop: '100%',
            background: '#336'
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: '5%',
              right: '5%',
              bottom: '5%',
              left: '5%',
              background: '#636',
              padding: '5%'
            }}
          >
            <VBox>
              <div>QR code reader will be placed here...</div>
              <Button
                onClick={e => {
                  e.preventDefault()
                  const refCode = prompt('refCode')
                  if (refCode) this.props.onScan(refCode)
                }}
              >
                Enter reference code
              </Button>
              <Button
                onClick={e => {
                  e.preventDefault()
                  this.setState({ real: true })
                }}
              >
                Enable real QR code scanner
              </Button>
            </VBox>
          </div>
        </div>
      )
    }
  }
}

export class PlaygroundStateManager extends React.Component<
  {},
  PlaygroundState
> {
  state = {
    kioskCheckInStatus: KioskCheckInStatus.Ready
  }
  render() {
    return (
      <Fragment>
        <playgroundStateContext.Provider value={this.state}>
          {this.props.children}
        </playgroundStateContext.Provider>
        <div
          style={{
            position: 'fixed',
            bottom: 10,
            right: 0,
            background: 'rgba(0,0,0,0.5)',
            color: '#fff'
          }}
        >
          <HBox alignItems="baseline">
            <span>Kiosk check in status:</span>
            <Button
              onClick={() =>
                this.setState({ kioskCheckInStatus: KioskCheckInStatus.Ready })
              }
            >
              Ready
            </Button>
            <Button
              onClick={() =>
                this.setState({
                  kioskCheckInStatus: KioskCheckInStatus.Success
                })
              }
            >
              Success
            </Button>
            <Button
              onClick={() =>
                this.setState({
                  kioskCheckInStatus: KioskCheckInStatus.NotFound
                })
              }
            >
              Not Found
            </Button>
          </HBox>
        </div>
      </Fragment>
    )
  }
}
