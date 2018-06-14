import React from 'react'
import { Panel, HBox, TextField, Button } from '../ui'
import { eventContext } from '../event-context'
import Track from 'react-pledge'
import { flashError, flashSuccess } from '../flash-message'
import { checkIn } from '../attendee-self-check-in'

export class SelfCheckinPanel extends React.Component {
  refCodeField: any
  totpField: any

  render() {
    return (
      <Panel title="Self Check-In">
        <eventContext.Consumer>
          {eventId => (
            <Track promise={this.onSubmit}>
              {(submit, { pending }) => (
                <form onSubmit={e => submit(e, eventId)}>
                  <HBox>
                    <label>
                      refCode:{' '}
                      <TextField
                        size={6}
                        innerRef={el => (this.refCodeField = el)}
                      />
                    </label>
                    <label>
                      totp:{' '}
                      <TextField
                        size={6}
                        innerRef={el => (this.totpField = el)}
                      />
                    </label>
                    <Button disabled={pending}>Check in</Button>
                  </HBox>
                </form>
              )}
            </Track>
          )}
        </eventContext.Consumer>
      </Panel>
    )
  }
  onSubmit = async (e, eventId) => {
    e.preventDefault()
    try {
      const refCode = this.refCodeField.value
      const totp = this.totpField.value
      const result = await checkIn(refCode, totp, eventId)
      if (result.data.error) {
        flashError(`Check in failure: ${result.data.error}`)
        return
      }
      flashSuccess(JSON.stringify(result.data))
    } catch (e) {
      flashError(`Cannot check in: ${e}`)
    }
  }
}
