import React from 'react'
import './design'
import 'noty/lib/noty.css'
import 'noty/lib/themes/mint.css'
import ReactDOM from 'react-dom'
import { HashRouter, Route, Switch, Link } from 'react-router-dom'
import { HomePage } from './home-page'
import { KioskPage, KioskPlaygroundPage } from './kiosk-page'
import { InternalPageLayout } from './ui'
import { FulfillmentPage } from './fulfillment'

class App extends React.Component {
  render() {
    return (
      <div>
        <Switch>
          <Route exact path="/" component={RootPage} />
          <Route exact path="/events/:eventId" component={HomePage} />
          <Route exact path="/events/:eventId/kiosk" component={KioskPage} />
          <Route
            exact
            path="/events/:eventId/fulfillment"
            component={FulfillmentPage}
          />
          <Route
            exact
            path="/events/:eventId/kiosk-playground"
            component={KioskPlaygroundPage}
          />
          <Route
            exact
            path="/events/:eventId/:activePanel"
            component={HomePage}
          />
          <Route component={NoMatch} />
        </Switch>
      </div>
    )
  }
}
class RootPage extends React.Component {
  render() {
    return (
      <InternalPageLayout>
        Welcome to ticket-checkin.<br />
        <Link to="/events/reactbkk3">reactbkk3</Link>
      </InternalPageLayout>
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
