import React from 'react'
import {
  FirebaseDataState,
  firebase,
  FirebaseData,
  FirebaseDataStatus
} from '../firebase'
import { eventContext } from '../event-context'
import { Loading } from '../ui'

export class EventData<T = any> extends React.Component<{
  toDataRef: (
    eventRef: firebase.database.Reference
  ) => firebase.database.Reference
  children: (
    state: FirebaseDataState<T>,
    ref: firebase.database.Reference
  ) => React.ReactNode
}> {
  render() {
    return (
      <eventContext.Consumer>
        {eventId => (
          <FirebaseData
            dataRef={this.props.toDataRef(
              firebase
                .database()
                .ref('events')
                .child(eventId)
            )}
          >
            {this.props.children}
          </FirebaseData>
        )}
      </eventContext.Consumer>
    )
  }
}

export function unwrapData<T>(
  state: FirebaseDataState<T>,
  render: (data: T) => React.ReactNode,
  thingName: React.ReactNode = 'data'
) {
  if (state.status === FirebaseDataStatus.Available) {
    return render(state.data!)
  }
  if (state.status === FirebaseDataStatus.Pending) {
    return (
      <div>
        <Loading>Loading {thingName}...</Loading>
      </div>
    )
  }
  if (state.status === FirebaseDataStatus.Error) {
    return (
      <div>
        <strong>Error!</strong> {`${state.error}`}
      </div>
    )
  }
  throw new Error('!')
}
