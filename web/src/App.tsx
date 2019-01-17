import React, {FunctionComponent} from 'react'
import {Router} from '@reach/router'

import Login from './auth/Login'
import {Routable} from './util/Routable'

const Home: FunctionComponent = () => <div>Home</div>

export const App = () => (
  <Router>
    <Routable component={<Home />} path="/" />
    <Routable component={<Login />} path="/auth/login" />
  </Router>
)
