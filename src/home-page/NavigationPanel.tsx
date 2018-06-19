import React from 'react'
import { Link } from 'react-router-dom'
import { eventContext } from '../event-context'
import { HBox } from '../ui'
export class NavigationPanel extends React.Component {
  render() {
    return (
      <eventContext.Consumer>
        {eventId => (
          <HBox wrap>
            <Link to={`/events/${eventId}/kiosk`}>Kiosk</Link>
            <Link to={`/events/${eventId}/kiosk-playground`}>(Playground)</Link>
            <Link to={`/events/${eventId}/fulfillment`}>Fulfillment</Link>
          </HBox>
        )}
      </eventContext.Consumer>
    )
  }
}
