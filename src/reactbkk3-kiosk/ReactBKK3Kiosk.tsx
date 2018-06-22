import React, { CSSProperties } from 'react'
import { AttendeeTotpViewModel, AttendeeTotpStatus } from '../attendee-totp'
import { KioskViewModel, KioskCheckInStatus } from '../checkin-kiosk'
import { kioskContext, KioskContext } from '../kiosk'
import styled from 'react-emotion'
import { Fonts } from '../design'

const FILL: CSSProperties = {
  position: 'absolute',
  top: 0,
  right: 0,
  bottom: 0,
  left: 0
}

export class ReactBKK3Kiosk extends React.Component {
  private rememberedName: string = ''
  private timeout: number
  state = { small: true }
  checkViewport = () => {
    const small = window.innerWidth < 2500
    if (small !== this.state.small) {
      this.setState({ small })
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
      <div
        style={{
          ...FILL,
          display: 'flex',
          flexDirection: 'column',
          fontSize: '48px',
          fontFamily: Fonts.display
        }}
      >
        <div style={{ borderBottom: '20px solid #61DAFB' }}>
          <img
            src={require('./Heading.png')}
            style={{ display: 'block', width: '100%', height: 'auto' }}
          />
        </div>
        <div style={{ flex: 1, position: 'relative' }}>
          <div style={{ ...FILL }}>
            <kioskContext.Consumer>
              {this.renderInContext}
            </kioskContext.Consumer>
          </div>
        </div>
      </div>
    )
  }
  renderInContext = (ctx: KioskContext) => {
    if (this.state.small) {
      return (
        <div style={{ flex: 1 }}>
          <div
            style={{ width: 1200, height: 1200, zoom: 0.5, margin: '0 auto' }}
          >
            <Heading background="#333">
              <HeadingText color="#fff">
                Present your QR code to check in
              </HeadingText>
            </Heading>
            <ctx.KioskCheckInProvider>
              {this.renderCheckIn}
            </ctx.KioskCheckInProvider>
          </div>
        </div>
      )
    }
    return (
      <div style={{ flex: 1, display: 'flex' }}>
        <div style={{ width: '41.875%', flex: 'none', position: 'relative' }}>
          <Heading background="#333">
            <HeadingText color="#fff">
              Present your QR code to check in
            </HeadingText>
          </Heading>
          <ctx.KioskCheckInProvider>
            {this.renderCheckIn}
          </ctx.KioskCheckInProvider>
        </div>
        <div style={{ flex: '1', position: 'relative' }}>
          <Heading background="#1DA1F2">
            <img
              src={require('./twitter/vendor/Twitter_Logo_WhiteOnImage.svg')}
              width={128}
              height={128}
              style={{ display: 'block' }}
            />
            <div
              style={{
                color: 'white',
                font: 'bold 56px Helvetica Neue, Helvetica, sans-serif',
                marginLeft: '0.5em'
              }}
            >
              #reactbkk<span style={{ fontWeight: 300 }}>@3.0.0</span>
            </div>
            <div style={{ ...FILL, top: '128px' }}>
              <iframe
                src="https://reactbkk-tweetboard.netlify.com/?list"
                style={{ width: '100%', height: '100%', border: 0 }}
              />
            </div>
          </Heading>
        </div>
        <div style={{ width: '28%' }}>
          <Heading background="#ECECEC">
            <HeadingText color="#333">…or use your phone</HeadingText>
          </Heading>
          <div style={{ padding: 40 }}>
            <ctx.TotpProvider>{this.renderTotp}</ctx.TotpProvider>
          </div>
        </div>
      </div>
    )
  }
  renderCheckIn = (state: KioskViewModel) => {
    let name = state.attendee && state.attendee.displayName
    if (name) {
      this.rememberedName = name
    }
    if (!name) {
      name = this.rememberedName
    }
    return (
      <div style={{ position: 'relative', overflow: 'hidden' }}>
        <kioskContext.Consumer>
          {ctx => <ctx.QrCodeReader onScan={state.handleRefCode} />}
        </kioskContext.Consumer>
        <FlashMessage
          background="#65C200"
          visible={state.status === KioskCheckInStatus.Success}
        >
          <strong>Welcome!</strong>
          <div
            style={{ fontSize: '120%', lineHeight: '1.3em', margin: '0.5em 0' }}
          >
            {name}
          </div>
          <div>Please proceed to receive your T-shirt and name tag.</div>
        </FlashMessage>
        <FlashMessage
          background="#D0021B"
          visible={state.status === KioskCheckInStatus.NotFound}
        >
          <strong>Ticket not recognized</strong>
          <br />Please contact a staff for further assistance.
        </FlashMessage>
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
        <Step number="1">
          Go to <strong>reactbkk.com</strong>
        </Step>
        <Step number="2">
          Press <strong>Check In</strong>
        </Step>
        <Step number="3">Enter your ticket reference code</Step>
        <Step number="4">Enter the following number:</Step>
        <div
          style={{
            display: 'block',
            fontSize: '2.8em',
            fontFamily: 'Roboto Mono',
            fontWeight: 300,
            textAlign: 'center',
            letterSpacing: '0.2ex'
          }}
        >
          <div style={{ paddingLeft: '0.2ex' }}>{state.totp}</div>
          <div
            key={state.totp || '^_^'}
            style={{
              background: '#888',
              transform: `scaleX(${state.fractionTimeLeft || 0})`,
              width: '80%',
              margin: '8px auto 0',
              height: 8,
              transition: '1s transform linear'
            }}
          />
        </div>
      </div>
    )
  }
}

const Heading = styled('div')(
  {
    display: 'flex',
    height: '128px',
    alignItems: 'center'
  },
  (props: { background: string }) => ({
    background: props.background
  })
)
const HeadingText = styled('div')(
  {
    flex: 'auto',
    textAlign: 'center',
    fontSize: '56px',
    fontWeight: 700,
    fontFamily: Fonts.display
  },
  (props: { color: string }) => ({ color: props.color })
)

class Step extends React.Component<{ number: string }> {
  render() {
    return (
      <div
        style={{ display: 'flex', marginBottom: 40, alignItems: 'baseline' }}
      >
        <div
          style={{
            width: 80,
            height: 80,
            background: 'black',
            color: '#61DAFB',
            borderRadius: '50%',
            textAlign: 'center',
            lineHeight: '84px',
            flex: 'none'
          }}
        >
          {this.props.number}
        </div>
        <div style={{ paddingLeft: 32 }}>{this.props.children}</div>
      </div>
    )
  }
}

const FlashMessage = styled('div')(
  {
    position: 'absolute',
    top: 0,
    right: 0,
    left: 0,
    padding: 40,
    transition: '0.3s transform',
    lineHeight: '1.3em',
    textShadow: '2px 2px 0 rgba(0,0,0,0.25)',
    zIndex: 9999
  },
  (props: { background: string; visible: boolean }) => ({
    background: props.background,
    transform: `translateY(${props.visible ? 0 : '-120%'})`
  })
)
