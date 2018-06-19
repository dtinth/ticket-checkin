import React, { Fragment } from 'react'
import Track from 'react-pledge'
import {
  firebase,
  FirebaseAuth,
  FirebaseAuthState,
  FirebaseAuthStatus
} from '../firebase'
import { BoxItem, Button, HBox, TextField, VBox } from '../ui'
import { Description } from './Description'

export class AuthenticationPanel extends React.Component {
  emailInput: HTMLInputElement
  passwordInput: HTMLInputElement
  render() {
    return (
      <FirebaseAuth>{authState => this.renderContent(authState)}</FirebaseAuth>
    )
  }
  renderContent(authState: FirebaseAuthState) {
    const authenticated = authState.status === FirebaseAuthStatus.Authenticated
    return (
      <VBox>
        <BoxItem>
          <Description>
            You need to authenticate to use the administrative functionalities.
          </Description>
        </BoxItem>
        <BoxItem>
          <HBox alignItems="baseline" wrap>
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
        </BoxItem>
        <Track promise={this.login}>
          {(submit, { pending, resolved, rejected, error }) => (
            <form onSubmit={submit}>
              <BoxItem>
                <VBox>
                  <HBox wrap>
                    <label>
                      Email:{' '}
                      <TextField
                        disabled={authenticated}
                        size={15}
                        innerRef={el => (this.emailInput = el)}
                        type="email"
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
              </BoxItem>
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
