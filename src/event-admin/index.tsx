import React from 'react'
import {
  firebase,
  FirebaseAuth,
  FirebaseAuthStatus,
  FirebaseData,
  FirebaseDataStatus
} from '../firebase'
import { eventContext } from '../event-context'
import { Loading } from '../ui'

export class AdminOnly extends React.Component<{
  children: (user: firebase.User) => React.ReactNode
}> {
  render() {
    return (
      <eventContext.Consumer>
        {eventId => (
          <FirebaseAuth>
            {({ user, status }) =>
              status === FirebaseAuthStatus.Checking ? (
                this.renderPending()
              ) : status === FirebaseAuthStatus.Authenticated ? (
                <FirebaseData
                  dataRef={firebase
                    .database()
                    .ref('events')
                    .child(eventId)
                    .child('admins')
                    .child(user!.uid)}
                >
                  {dataState =>
                    dataState.status === FirebaseDataStatus.Pending
                      ? this.renderPending()
                      : dataState.status === FirebaseDataStatus.Available &&
                        dataState.data
                        ? this.props.children(user!)
                        : this.renderUnauthorized()
                  }
                </FirebaseData>
              ) : (
                this.renderUnauthorized()
              )
            }
          </FirebaseAuth>
        )}
      </eventContext.Consumer>
    )
  }
  renderPending() {
    return (
      <div>
        <Loading>Checking access rights...</Loading>
      </div>
    )
  }
  renderUnauthorized() {
    return <div>(You must be an admin to view this section.)</div>
  }
}
