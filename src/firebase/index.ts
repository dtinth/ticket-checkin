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
    if (this.state.status === FirebaseAuthStatus.Error) {
      this.observe()
    }
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

export enum FirebaseDataStatus {
  Pending = 'pending',
  Available = 'available',
  Error = 'error'
}

export interface FirebaseDataState<T> {
  status: FirebaseDataStatus
  data: T | null
  error: Error | null
  retry: () => any
}

export class FirebaseData<T = any> extends React.Component<
  {
    dataRef: firebase.database.Reference
    children: (
      dataState: FirebaseDataState<T>,
      ref: firebase.database.Reference
    ) => React.ReactNode
  },
  FirebaseDataState<T>
> {
  private dataRef?: firebase.database.Reference
  state = {
    status: FirebaseDataStatus.Pending,
    data: null,
    error: null,
    retry: () => this.retry()
  }

  componentDidMount() {
    this.setDataRef(this.props.dataRef)
  }

  setDataRef(ref: firebase.database.Reference) {
    if (this.dataRef) {
      this.dataRef.off('value', this.onUpdate)
    }
    this.dataRef = ref
    this.setState({ status: FirebaseDataStatus.Pending })
    ref.on('value', this.onUpdate, this.onError)
  }

  componentWillUnmount() {
    if (this.dataRef) {
      this.dataRef.off('value', this.onUpdate)
    }
  }

  componentDidUpdate(prevProps) {
    if (!this.props.dataRef.isEqual(prevProps.dataRef)) {
      this.setDataRef(this.props.dataRef)
    }
  }

  retry() {
    if (this.dataRef && this.state.status === FirebaseDataStatus.Error) {
      this.setDataRef(this.dataRef)
    }
  }

  onUpdate = snapshot => {
    this.setState({
      status: FirebaseDataStatus.Available,
      data: snapshot.val() as T,
      error: null
    })
  }
  onError = error => {
    this.setState({
      status: FirebaseDataStatus.Error,
      error
    })
  }
  render() {
    return this.props.children(
      this.state,
      this.dataRef && this.props.dataRef.isEqual(this.dataRef)
        ? this.dataRef
        : this.props.dataRef
    )
  }
}

export { firebase }
