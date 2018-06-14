import Noty from 'noty'

export function flashError(text) {
  new Noty({ text, type: 'error' }).show()
}

export function flashSuccess(text) {
  new Noty({
    text: text,
    type: 'success',
    timeout: 5000
  }).show()
}
