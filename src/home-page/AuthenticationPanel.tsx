import React, { Fragment } from 'react'
import { Panel, VBox, HBox, Button, TextField } from '../ui'
import {
  FirebaseAuth,
  FirebaseAuthState,
  firebase,
  FirebaseAuthStatus
} from '../firebase'
import Track from 'react-pledge'

export class AuthenticationPanel extends React.Component {
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
            {!!authState.user && (
              <Fragment>
                {' '}
                as {authState.user.displayName || authState.user.email}
              </Fragment>
            )}
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
