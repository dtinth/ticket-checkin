import React from 'react'
import './design'
import 'noty/lib/noty.css'
import 'noty/lib/themes/mint.css'
import ReactDOM from 'react-dom'
import { HashRouter, Route, Switch, Link } from 'react-router-dom'
import { HomePage } from './home-page'

class App extends React.Component {
  render() {
    return (
      <div>
        <Switch>
          <Route exact path="/" component={HomePage} />
          <Route component={NoMatch} />
        </Switch>
      </div>
    )
  }
}
class NoMatch extends React.Component {
  render() {
    return (
      <div>
        Route not matched... <Link to="/">Go home?</Link>
      </div>
    )
  }
}

ReactDOM.render(
  <HashRouter>
    <App />
  </HashRouter>,
  document.getElementById('root') as HTMLElement
)

if ('hot' in module) {
  ;(module as any).hot.accept()
}
