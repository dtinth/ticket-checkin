import React from 'react'
import { AdminOnly } from '../event-admin'
import { eventContext } from '../event-context'
import { Kiosk } from '../config'
import { kioskContext } from '../kiosk'
import { playgroundKioskContext, PlaygroundStateManager } from '../kiosk'

export class KioskPage extends React.Component<{ match: any }> {
  render() {
    const { eventId } = this.props.match.params
    return (
      <eventContext.Provider value={eventId}>
        <AdminOnly>{() => <Kiosk />}</AdminOnly>
      </eventContext.Provider>
    )
  }
}

export class KioskPlaygroundPage extends React.Component<{ match: any }> {
  render() {
    return (
      <PlaygroundStateManager>
        <kioskContext.Provider value={playgroundKioskContext}>
          <Kiosk />
        </kioskContext.Provider>
      </PlaygroundStateManager>
    )
  }
}
