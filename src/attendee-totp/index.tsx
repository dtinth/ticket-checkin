import React, { ReactNode } from 'react'
import { EventData } from '../event-data'
import { FirebaseDataState } from '../firebase'
import { authenticator } from '../totp'
export enum AttendeeTotpStatus {
  Initializing = 'initializing',
  InitializationError = 'initialization error',
  Ready = 'ready'
}

export interface AttendeeTotpViewModel {
  status: AttendeeTotpStatus
  error?: Error
  totp: string | null
  fractionTimeLeft?: number
}

export class AttendeeTotpController extends React.Component<{
  children: (state: AttendeeTotpViewModel) => ReactNode
}> {
  render() {
    return (
      <EventData toDataRef={r => r.child('keys').child('attendee')}>
        {state => (
          <TotpController keyState={state}>
            {this.props.children}
          </TotpController>
        )}
      </EventData>
    )
  }
}

class TotpController extends React.Component<{
  keyState: FirebaseDataState<string>
  children: (state: AttendeeTotpViewModel) => ReactNode
}> {
  unmounted = false
  timeout: number | null = null
  render() {
    if (this.props.keyState.data) {
      return this.props.children({
        status: AttendeeTotpStatus.Ready,
        totp: authenticator.generate(this.props.keyState.data),
        fractionTimeLeft: (30000 - (Date.now() % 30000)) / 30000
      })
    } else if (this.props.keyState.error) {
      return this.props.children({
        status: AttendeeTotpStatus.InitializationError,
        error: this.props.keyState.error,
        totp: null
      })
    } else {
      return this.props.children({
        status: AttendeeTotpStatus.Initializing,
        totp: null
      })
    }
  }
  componentDidUpdate() {
    if (this.timeout) return
    if (!this.props.keyState.data) return
    this.timeout = window.setTimeout(() => {
      this.timeout = null
      if (this.unmounted) return
      this.forceUpdate()
    }, 1000)
  }
  componentWillUnmount() {
    this.unmounted = true
  }
}
