import React from 'react'
import { Link } from 'react-router-dom'
import { Panel, TextField, Button, HBox, VBox } from '../ui'
import QrReader from 'react-qr-reader'
import Noty from 'noty'
import {
  FirebaseAuthState,
  FirebaseAuth,
  firebase,
  FirebaseAuthStatus
} from '../firebase'
import Track from 'react-pledge'

export class HomePage extends React.Component {
  render() {
    const column = { flex: '1 1 500px' }
    const item = { margin: 10 }
    return (
      <div style={{ margin: '20px' }}>
        <h1>ticket-checkin</h1>
        <div style={{ display: 'flex', flexWrap: 'wrap', margin: -10 }}>
          <div style={column}>
            <div style={item}>
              <NavigationPanel />
            </div>
            <div style={item}>
              <AuthenticationPanel />
            </div>
          </div>
          <div style={column}>
            <div style={item}>
              <CodeScannerPanel />
            </div>
            <div style={item}>
              <AttendeeTOTPPanel />
            </div>
          </div>
        </div>
      </div>
    )
  }
}

class NavigationPanel extends React.Component {
  render() {
    return (
      <Panel title="Navigation">
        <HBox>
          <Link to="/kiosk">Kiosk</Link>
          <Link to="/staff">Staff check-in</Link>
          <Link to="/fulfillment">Fulfillment</Link>
        </HBox>
      </Panel>
    )
  }
}

class AuthenticationPanel extends React.Component {
  emailInput: HTMLInputElement
  passwordInput: HTMLInputElement
  render() {
    return (
      <Panel title="Authentication">
        <FirebaseAuth>
          {authState => this.renderContent(authState)}
        </FirebaseAuth>
      </Panel>
    )
  }
  renderContent(authState: FirebaseAuthState) {
    const authenticated = authState.status === FirebaseAuthStatus.Authenticated
    return (
      <VBox>
        <HBox alignItems="baseline">
          <span>
            Status: <strong>{authState.status}</strong>
          </span>
          <Button disabled={!authenticated} onClick={this.logout}>
            Log out
          </Button>
        </HBox>
        <Track promise={this.login}>
          {(submit, { pending, resolved, rejected, error }) => (
            <form onSubmit={submit}>
              <VBox>
                <HBox>
                  <label>
                    Email:{' '}
                    <TextField
                      disabled={authenticated}
                      size={15}
                      innerRef={el => (this.emailInput = el)}
                    />
                  </label>
                  <label>
                    Password:{' '}
                    <TextField
                      disabled={authenticated}
                      size={15}
                      innerRef={el => (this.passwordInput = el)}
                      type="password"
                    />
                  </label>
                  <Button disabled={pending || authenticated}>Login</Button>
                </HBox>
                <div>
                  [{pending
                    ? 'Signing in...'
                    : resolved
                      ? 'Success'
                      : rejected
                        ? `${error}`
                        : '-'}]
                </div>
              </VBox>
            </form>
          )}
        </Track>
      </VBox>
    )
  }
  login = async e => {
    e.preventDefault()
    return firebase
      .auth()
      .signInWithEmailAndPassword(
        this.emailInput.value,
        this.passwordInput.value
      )
  }
  logout = e => {
    firebase.auth().signOut()
    e.preventDefault()
  }
}

class CodeScannerPanel extends React.Component<{}, { enabled: boolean }> {
  state = {
    enabled: false
  }
  handleError = e => {
    new Noty({ text: `Error scanning: ${e}`, type: 'error' }).show()
  }
  handleScan = c => {
    if (!c) {
      return
    }
    new Noty({
      text: `Scanned QR code: ${c}`,
      type: 'success',
      timeout: 3000
    }).show()
  }
  onEnable = e => {
    this.setState({ enabled: true })
  }
  render() {
    const { enabled } = this.state
    return (
      <Panel title="Code scanner">
        {enabled ? (
          this.renderQRReader()
        ) : (
          <Button onClick={this.onEnable}>Enable</Button>
        )}
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

class AttendeeTOTPPanel extends React.Component {
  render() {
    return (
      <Panel title="Attendee TOTP">
        <Button>Generate code for attendee</Button>
      </Panel>
    )
  }
}
