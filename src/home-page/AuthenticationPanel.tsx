import React, { Fragment } from 'react'
import { Panel, VBox, HBox, Button, TextField, BoxItem } from '../ui'
import {
  FirebaseAuth,
  FirebaseAuthState,
  firebase,
  FirebaseAuthStatus
} from '../firebase'
import Track from 'react-pledge'
import { Description } from './Description'

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
