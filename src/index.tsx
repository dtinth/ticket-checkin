import './index.css'

import * as React from 'react'
import * as ReactDOM from 'react-dom'
import registerServiceWorker from './registerServiceWorker'

class App extends React.Component {
  render() {
    return <div>Ticket checkin tool.</div>
  }
}

ReactDOM.render(<App />, document.getElementById('root') as HTMLElement)
registerServiceWorker()
