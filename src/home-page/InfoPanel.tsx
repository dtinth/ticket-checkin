import React, { ReactNode } from 'react'
import { Panel, VBox } from '../ui'
import { AdminOnly } from '../event-admin'
import { EventData, unwrapData } from '../event-data'
export class InfoPanel extends React.Component {
  render() {
    return (
      <Panel title="Information">
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
      </Panel>
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
            {list.map(({ refCode, checkIn }) => (
              <li>
                <AttendeeName refCode={refCode} />
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
