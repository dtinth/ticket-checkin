import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'
import 'firebase/functions'
import React from 'react'

const config = {
  apiKey: 'AIzaSyArlCTRDavgp9cpPye1quMsGD2yUTo09RA',
  authDomain: 'reactbkk3-tickets-checkin.firebaseapp.com',
  databaseURL: 'https://reactbkk3-tickets-checkin.firebaseio.com',
  projectId: 'reactbkk3-tickets-checkin',
  storageBucket: 'reactbkk3-tickets-checkin.appspot.com',
  messagingSenderId: '62905185597'
}
firebase.initializeApp(config)

// For debugging.
Object.assign(window, { firebase })

export enum FirebaseAuthStatus {
  Checking = 'checking',
  Authenticated = 'authenticated',
  Unauthenticated = 'unauthenticated',
  Error = 'error'
}

export interface FirebaseAuthState {
  status: FirebaseAuthStatus
  user: firebase.User | null
  error: firebase.auth.Error | null
  retry: () => any
}

export class FirebaseAuth extends React.Component<
  { children: (authState: FirebaseAuthState) => React.ReactNode },
  FirebaseAuthState
> {
  private unsubscribe: () => any

  auth = firebase.auth()
  state = {
    status: FirebaseAuthStatus.Checking,
    user: null,
    error: null,
    retry: () => this.retry()
  }
  retry() {
    this.observe()
  }
  observe() {
    this.unsubscribe = this.auth.onAuthStateChanged(
      user => {
        this.setState({
          status: user
            ? FirebaseAuthStatus.Authenticated
            : FirebaseAuthStatus.Unauthenticated,
          user: user
        })
      },
      error => {
        this.setState({
          status: FirebaseAuthStatus.Error,
          error: error
        })
      }
    )
  }
  componentDidMount() {
    this.observe()
  }
  componentWillUnmount() {
    this.unsubscribe()
  }
  render() {
    return this.props.children(this.state)
  }
}

export { firebase }
