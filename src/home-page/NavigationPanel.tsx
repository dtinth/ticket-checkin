import React from 'react'
import { Link } from 'react-router-dom'
import { Panel, HBox } from '../ui'
import { eventContext } from '../event-context'
export class NavigationPanel extends React.Component {
  render() {
    return (
      <Panel title="Navigation">
        <eventContext.Consumer>
          {eventId => (
            <HBox wrap>
              <Link to={`/events/${eventId}/kiosk`}>Kiosk</Link>
              <Link to={`/events/${eventId}/kiosk-playground`}>
                (Playground)
              </Link>
              <Link to={`/events/${eventId}/staff`}>Staff check-in</Link>
              <Link to={`/events/${eventId}/fulfillment`}>Fulfillment</Link>
            </HBox>
          )}
        </eventContext.Consumer>
      </Panel>
    )
  }
}
