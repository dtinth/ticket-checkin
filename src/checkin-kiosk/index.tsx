import React, { ReactNode } from 'react'
import { writeCheckinRecord, IAttendee } from '../checkin-firebase'
import { EventData } from '../event-data'
import { firebase, FirebaseDataState } from '../firebase'

export enum KioskCheckInStatus {
  Initializing = 'initializing',
  InitializationError = 'initialization error',
  Ready = 'ready',
  Success = 'success',
  NotFound = 'not found'
}

export interface KioskViewModel {
  status: KioskCheckInStatus
  error?: Error
  attendee?: IAttendee | null
  handleRefCode(refCode: string): void
}

export class KioskCheckInController extends React.Component<{
  children: (state: KioskViewModel) => ReactNode
}> {
  render() {
    return (
      <EventData toDataRef={e => e.child('attendees')}>
        {(attendeesState, attendeesRef) => (
          <KioskStateController
            attendeesState={attendeesState}
            attendeesRef={attendeesRef}
          >
            {this.props.children}
          </KioskStateController>
        )}
      </EventData>
    )
  }
}

class KioskStateController extends React.Component<
  {
    attendeesState: FirebaseDataState<{ [refCode: string]: IAttendee }>
    attendeesRef: firebase.database.Reference
    children: (state: KioskViewModel) => ReactNode
  },
  KioskViewModel
> {
  state = {
    status: KioskCheckInStatus.Ready,
    handleRefCode: refCode => this.handleRefCode(refCode)
  }
  currentRefCode: string | null
  render() {
    const { attendeesState } = this.props
    if (attendeesState.data) {
      return this.props.children(this.state)
    } else if (attendeesState.error) {
      return this.props.children({
        status: KioskCheckInStatus.InitializationError,
        error: attendeesState.error,
        handleRefCode: () => {}
      })
    } else {
      return this.props.children({
        status: KioskCheckInStatus.Initializing,
        handleRefCode: () => {}
      })
    }
  }
  handleRefCode(refCode: string) {
    if (this.currentRefCode === refCode) {
      return
    }
    this.currentRefCode = refCode
    const attendees = this.props.attendeesState.data!
    if (attendees[refCode]) {
      this.setState({
        status: KioskCheckInStatus.Success,
        attendee: attendees[refCode]
      })
      const attendeesRef = this.props.attendeesRef
      writeCheckinRecord(attendeesRef, refCode, 'kiosk')
    } else {
      this.setState({
        status: KioskCheckInStatus.NotFound,
        attendee: null
      })
    }
    setTimeout(() => {
      if (this.currentRefCode !== refCode) {
        return
      }
      this.currentRefCode = null
      this.setState({
        status: KioskCheckInStatus.Ready,
        attendee: null
      })
    }, 5000)
  }
}
