import React, { ReactNode } from 'react'
import { AdminOnly } from '../event-admin'
import { EventData, unwrapData } from '../event-data'
import { VBox } from '../ui'
export class InfoPanel extends React.Component {
  render() {
    return (
      <AdminOnly>
        {() => (
          <EventData toDataRef={r => r.child('checkins')}>
            {data =>
              unwrapData(
                data,
                checkIns => this.renderContents(checkIns || {}),
                'checkins'
              )
            }
          </EventData>
        )}
      </AdminOnly>
    )
  }
  renderContents(checkIns: {
    [refCode: string]: { time: number; mode: string }
  }): ReactNode {
    const list = Object.keys(checkIns).map(refCode => ({
      refCode,
      checkIn: checkIns[refCode]
    }))
    list.sort((a, b) => b.checkIn.time - a.checkIn.time)
    return (
      <VBox>
        <strong>{Object.keys(checkIns).length} people checked in.</strong>
        <div>
          Latest people to check in:
          <ul>
            {list.slice(0, 15).map(({ refCode, checkIn }, i) => (
              <li key={refCode}>
                #{list.length - i}: <AttendeeName refCode={refCode} />
              </li>
            ))}
          </ul>
        </div>
      </VBox>
    )
  }
}

class AttendeeName extends React.Component<{ refCode: string }> {
  render() {
    return (
      <EventData
        toDataRef={r => r.child('attendees').child(this.props.refCode)}
      >
        {state =>
          state.error
            ? `Error: ${state.error}`
            : state.data
              ? `${state.data.displayName}`
              : '...'
        }
      </EventData>
    )
  }
}
