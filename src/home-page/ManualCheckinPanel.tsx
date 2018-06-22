import React, { createContext } from 'react'
import { AdminOnly } from '../event-admin'
import { VBox, TextField, ErrorMessage, Button } from '../ui'
import { Description } from './Description'
import { unwrapData, EventData } from '../event-data'
import { IAttendee, writeCheckinRecord } from '../checkin-firebase'
import { firebase } from '../firebase'
import styled from 'react-emotion'
import { saveLog } from '../local-logs'

const checkedInContext = createContext(new Set())

export class ManualCheckinPanel extends React.Component {
  render() {
    return (
      <VBox>
        <Description>
          The <strong>manual check-in</strong> method is a last resort, where an
          attendee couldn’t find their ticket. Like check-in counters at
          airports, attendees can check-in by providing their personal
          information that matches the records in the database.
        </Description>
        <AdminOnly>
          {() => (
            <EventData toDataRef={e => e.child('checkins')}>
              {(checkinsState, checkinsRef) => (
                <EventData toDataRef={e => e.child('attendees')}>
                  {(attendeesState, attendeesRef) =>
                    unwrapData(
                      checkinsState,
                      checkins => (
                        <checkedInContext.Provider
                          value={new Set(Object.keys(checkins || {}))}
                        >
                          {unwrapData(
                            attendeesState,
                            attendees => (
                              <ManualCheckinView
                                attendees={attendees}
                                attendeesRef={attendeesRef}
                              />
                            ),
                            'attendee list'
                          )}
                        </checkedInContext.Provider>
                      ),
                      'checked-in attendees list'
                    )
                  }
                </EventData>
              )}
            </EventData>
          )}
        </AdminOnly>
      </VBox>
    )
  }
}

class ManualCheckinView extends React.PureComponent<{
  attendees: { [k: string]: IAttendee }
  attendeesRef: firebase.database.Reference
}> {
  state = {
    value: '',
    extended: false
  }
  render() {
    return (
      <div>
        <TextField
          type="search"
          placeholder="Enter ref code, name, or anything actually..."
          style={{ boxSizing: 'border-box', width: '100%' }}
          value={this.state.value}
          onChange={e => {
            this.setState({ value: e.target.value, extended: false })
          }}
          onKeyDown={e => {
            if (e.keyCode === 13) {
              this.setState({ extended: true })
            }
          }}
        />
        {this.renderResult()}
      </div>
    )
  }
  renderResult() {
    if (!this.state.value) {
      return <div>Please enter a search term...</div>
    }
    let regex
    try {
      regex = new RegExp(this.state.value, 'i')
    } catch (e) {
      return <ErrorMessage>Error compiling regex: {`${e}`}</ErrorMessage>
    }
    const results = Object.keys(this.props.attendees)
      .map(k => {
        const attendee = this.props.attendees[k]
        if (regex.test(attendee.displayName)) {
          return { refCode: k, attendee, extras: [] }
        }
        if (attendee.searchableIndex) {
          const found: { key: string; value: string }[] = []
          for (const ik of Object.keys(attendee.searchableIndex)) {
            if (regex.test(attendee.searchableIndex[ik])) {
              found.push({
                key: ik,
                value: attendee.searchableIndex[ik]
              })
            }
          }
          if (found.length) return { refCode: k, attendee, extras: found }
        }
        return
      })
      .filter(x => x)
    if (!results.length) {
      return <ErrorMessage>Nothing found :(</ErrorMessage>
    }
    const visibleResult = results.filter(
      r => this.state.extended || !r!.extras.length
    )
    return (
      <ResultList>
        {visibleResult.slice(0, 20).map(r => {
          const result = r!
          return (
            <AttendeeResultItem
              key={result.refCode}
              result={result}
              attendeesRef={this.props.attendeesRef}
            />
          )
        })}
        {visibleResult.length < results.length && (
          <ResultItem>
            {results.length - visibleResult.length} hidden items matching
            personal information.<br />
            Press enter to show.
          </ResultItem>
        )}
      </ResultList>
    )
  }
}

class AttendeeResultItem extends React.PureComponent<{
  result: {
    refCode: string
    attendee: IAttendee
    extras: { key: string; value: string }[]
  }
  attendeesRef: firebase.database.Reference
}> {
  render() {
    const { result } = this.props
    return (
      <ResultItem>
        <div style={{ display: 'flex' }}>
          <div style={{ flex: 'auto' }}>
            {result.attendee.displayName}
            {result.extras ? (
              <div>
                {result.extras.map(e => (
                  <KeyValue keyName={e.key} value={e.value} />
                ))}
              </div>
            ) : null}
          </div>
          <div style={{ flex: 'none' }}>
            <checkedInContext.Consumer>
              {set =>
                !set.has(result.refCode) ? (
                  <Button onClick={this.checkIn}>Check in</Button>
                ) : (
                  <Button danger onClick={this.undoCheckIn}>
                    Undo
                  </Button>
                )
              }
            </checkedInContext.Consumer>
          </div>
        </div>
      </ResultItem>
    )
  }
  checkIn = () => {
    writeCheckinRecord(
      this.props.attendeesRef,
      this.props.result.refCode,
      'manual'
    )
  }
  undoCheckIn = () => {
    if (window.confirm('Are you really sure???')) {
      const refCode = this.props.result.refCode
      const attendeesRef = this.props.attendeesRef
      // XXX: This is an ugly hack.
      attendeesRef
        .parent!.child('checkins')
        .child(refCode)
        .remove()
      saveLog({
        type: 'undo',
        eventId: attendeesRef.parent!.key,
        refCode
      })
    }
  }
}

const ResultList = styled('div')({
  marginTop: 10,
  border: '1px solid #555'
})
const ResultItem = styled('div')({
  padding: 5,
  '&:not(:first-child)': {
    borderTop: '1px solid #555'
  }
})

class KeyValue extends React.PureComponent<{ keyName: string; value: string }> {
  render() {
    return (
      <span
        style={{
          display: 'inline-block',
          border: '1px solid #555',
          background: '#111',
          marginRight: 10,
          fontSize: '85%',
          padding: '2px 3px'
        }}
      >
        <strong style={{ opacity: 0.5 }}>{this.props.keyName}</strong>{' '}
        {this.props.value}
      </span>
    )
  }
}
