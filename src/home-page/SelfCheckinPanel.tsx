import React from 'react'
import Track from 'react-pledge'
import { checkIn } from '../checkin-self'
import { eventContext } from '../event-context'
import { flashError, flashSuccess } from '../flash-message'
import { Button, HBox, Panel, TextField } from '../ui'

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
      if ('error' in result) {
        flashError(`Check in failure: ${result.error}`)
        return
      }
      flashSuccess(JSON.stringify(result))
    } catch (e) {
      flashError(`Cannot check in: ${e}`)
    }
  }
}
