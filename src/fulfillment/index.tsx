import React from 'react'
import { AdminOnly } from '../event-admin'
import { eventContext } from '../event-context'
import { InternalPageLayout } from '../ui'

export class FulfillmentPage extends React.Component<{ match: any }> {
  render() {
    const { eventId } = this.props.match.params
    return (
      <eventContext.Provider value={eventId}>
        <AdminOnly>{() => <Fulfillment />}</AdminOnly>
      </eventContext.Provider>
    )
  }
}

class Fulfillment extends React.Component {
  render() {
    return <InternalPageLayout>TODO</InternalPageLayout>
  }
}
