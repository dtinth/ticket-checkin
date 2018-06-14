import React from 'react'
import { Link } from 'react-router-dom'
import { Panel, HBox } from '../ui'
export class NavigationPanel extends React.Component {
  render() {
    return (
      <Panel title="Navigation">
        <HBox>
          <Link to="/kiosk">Kiosk</Link>
          <Link to="/staff">Staff check-in</Link>
          <Link to="/fulfillment">Fulfillment</Link>
        </HBox>
      </Panel>
    )
  }
}
