import React from 'react'
import { FirebaseData, firebase, FirebaseDataStatus } from '../firebase'
import styled from 'react-emotion'

export class FirebaseStatusIndicator extends React.Component {
  render() {
    return (
      <FirebaseData dataRef={firebase.database().ref('.info/connected')}>
        {state => (
          <StatusView
            status={
              state.status === FirebaseDataStatus.Pending
                ? 'connecting'
                : state.data
                  ? 'online'
                  : 'offline'
            }
          >
            {state.status === FirebaseDataStatus.Pending
              ? 'Connecting'
              : state.data
                ? 'Online'
                : 'Offline'}
          </StatusView>
        )}
      </FirebaseData>
    )
  }
}

const StatusView = styled('div')(
  {
    position: 'fixed',
    bottom: 8,
    right: 8,
    padding: '2px 3px',
    borderRadius: 3,
    color: 'white',
    fontSize: '0.75em',
    textTransform: 'uppercase'
  },
  (props: { status: 'connecting' | 'online' | 'offline' }) => ({
    background:
      props.status === 'connecting'
        ? '#888'
        : props.status === 'online'
          ? '#282'
          : '#e66'
  })
)
