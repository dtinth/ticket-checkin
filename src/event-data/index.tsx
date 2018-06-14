import React from 'react'
import {
  FirebaseDataState,
  firebase,
  FirebaseDataStatus,
  FirebaseData
} from '../firebase'
import { eventContext } from '../event-context'

export class EventData<T> extends React.Component<{
  toDataRef: (
    eventRef: firebase.database.Reference
  ) => firebase.database.Reference
  children: (state: FirebaseDataState<T>) => React.ReactNode
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
