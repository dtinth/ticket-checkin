import ObjectID from 'bson-objectid'
import React, { Fragment, ReactNode } from 'react'
import { AdminOnly } from '../event-admin'
import { eventContext } from '../event-context'
import { EventData, unwrapData } from '../event-data'
import { firebase } from '../firebase'
import { flashError } from '../flash-message'
import { BoxItem, Button, HBox, InternalPageLayout, VBox } from '../ui'

export class FulfillmentPage extends React.Component<{ match: any }> {
  render() {
    const { eventId } = this.props.match.params
    return (
      <eventContext.Provider value={eventId}>
        <AdminOnly>{user => <Fulfillment userId={user.uid} />}</AdminOnly>
      </eventContext.Provider>
    )
  }
}

class Fulfillment extends React.Component<{ userId: string }> {
  render() {
    return (
      <InternalPageLayout>
        <h1>Fulfillment</h1>
        <FulfillmentContainer userId={this.props.userId} />
      </InternalPageLayout>
    )
  }
}

class FulfillmentContainer extends React.Component<{ userId: string }> {
  getOrGenerateClientId(): string {
    const storageKey = 'ticket-checkin:fulfillment:clientId'
    const existingId = localStorage.getItem(storageKey)
    if (existingId) return existingId
    const generatedId = ObjectID.generate()
    localStorage.setItem(storageKey, generatedId)
    return generatedId
  }
  state = {
    clientId: this.getOrGenerateClientId()
  }
  render() {
    const clientId = this.state.clientId
    return (
      <div>
        <VBox>
          <BoxItem>
            Client identifier:<br />
            {clientId}
          </BoxItem>
          <FulfillmentClient clientId={clientId} userId={this.props.userId}>
            {state => (
              <Fragment>
                <BoxItem>{this.renderToggler(state)}</BoxItem>
              </Fragment>
            )}
          </FulfillmentClient>
        </VBox>
      </div>
    )
  }

  renderToggler(state: FulfillmentClientState) {
    const accepting = state.acceptingNewJob
    return (
      <Fragment>
        <HBox wrap>
          <BoxItem>
            <Button disabled={accepting} onClick={state.acceptNewJob}>
              Look for a new job
            </Button>
          </BoxItem>
          <BoxItem>
            <Button disabled={!accepting} onClick={state.stopLookingForNewJobs}>
              Cancel
            </Button>
          </BoxItem>
        </HBox>
      </Fragment>
    )
  }
}

class FulfillmentClient extends React.Component<{
  clientId: string
  userId: string
  children: (state: FulfillmentClientState) => ReactNode
}> {
  render() {
    return (
      <EventData
        toDataRef={eventRef =>
          eventRef
            .child('fulfillment')
            .child(this.props.userId)
            .child(this.props.clientId)
        }
      >
        {(fulfillmentState, fulfillmentRef) =>
          unwrapData(fulfillmentState, fulfillment =>
            this.renderContent(fulfillment, fulfillmentRef)
          )
        }
      </EventData>
    )
  }
  renderContent(fulfillment: any, fulfillmentRef: firebase.database.Reference) {
    const availableId = (fulfillment || {}).available
    const acceptingNewJob =
      !!availableId && !((fulfillment || {}).jobs || {})[availableId]
    return this.props.children({
      acceptingNewJob: acceptingNewJob,
      acceptNewJob: () => {
        fulfillmentRef
          .child('available')
          .set(ObjectID.generate())
          .catch(e => flashError(`Cannot accept job: ${e}`))
      },
      stopLookingForNewJobs: () => {
        fulfillmentRef
          .child('available')
          .set(null)
          .catch(e => flashError(`Cannot stop accepting jobs: ${e}`))
      }
    })
  }
}

interface FulfillmentClientState {
  acceptingNewJob: boolean
  acceptNewJob()
  stopLookingForNewJobs()
}
