import ObjectID from 'bson-objectid'
import React, { Fragment, ReactNode } from 'react'
import { AdminOnly } from '../event-admin'
import { eventContext } from '../event-context'
import { EventData, unwrapData } from '../event-data'
import { firebase } from '../firebase'
import { flashError } from '../flash-message'
import { BoxItem, Button, HBox, InternalPageLayout, VBox, Loading } from '../ui'
import { FirebaseStatusIndicator } from '../firebase-status'

export class FulfillmentPage extends React.Component<{ match: any }> {
  render() {
    const { eventId } = this.props.match.params
    return (
      <eventContext.Provider value={eventId}>
        <AdminOnly>{user => <Fulfillment userId={user.uid} />}</AdminOnly>
        <FirebaseStatusIndicator />
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
                <BoxItem>{this.renderActiveJob(state)}</BoxItem>
                <BoxItem>{this.renderPastJobs(state)}</BoxItem>
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
  renderActiveJob(state: FulfillmentClientState) {
    const accepting = state.acceptingNewJob
    return (
      <div
        style={{
          border: '1px solid rgba(255,255,255,0.25)',
          padding: 10,
          textAlign: 'center'
        }}
      >
        {state.activeJob ? (
          <VBox>
            <BoxItem>
              Active job:<br />
              <strong style={{ fontSize: '125%' }}>
                {state.activeJob.displayName}
              </strong>
            </BoxItem>
            <BoxItem>
              <Button onClick={state.stopLookingForNewJobs}>Finish job</Button>
            </BoxItem>
          </VBox>
        ) : accepting ? (
          <Loading>Waiting for a job to be assigned</Loading>
        ) : (
          <Fragment>
            No active job.<br />
            Click{' '}
            <Button disabled={accepting} onClick={state.acceptNewJob}>
              Look for a new job
            </Button>{' '}
            to begin.
          </Fragment>
        )}
      </div>
    )
  }
  renderPastJobs(state: FulfillmentClientState) {
    return (
      <Fragment>
        Past jobs:
        <ul style={{ margin: 0 }}>
          {state.previousJobs.slice(0, 10).map((job, index) => (
            <li key={job._id}>
              {state.previousJobs.length - index}. {job.displayName}
            </li>
          ))}
        </ul>
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
    const jobsObject = (fulfillment || {}).jobs || {}
    const acceptingNewJob = !!availableId && !jobsObject[availableId]
    const jobs: FulfillmentJob[] = Object.keys(jobsObject).map(k => {
      return {
        _id: k,
        ...jobsObject[k]
      }
    })
    const activeJob = jobs.find(job => availableId && job._id === availableId)
    const previousJobs = jobs
      .filter(job => job !== activeJob)
      .sort((a, b) => b.time - a.time)
    return this.props.children({
      acceptingNewJob: acceptingNewJob,
      activeJob,
      previousJobs,
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
  activeJob?: FulfillmentJob
  previousJobs: FulfillmentJob[]
  acceptNewJob()
  stopLookingForNewJobs()
}

interface FulfillmentJob {
  _id: string
  time: number
  refCode: string
  displayName: string
}
