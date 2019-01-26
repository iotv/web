import React, {FunctionComponent} from 'react'
import {Router} from '@reach/router'

import {Login} from './auth/Login'

const Home: FunctionComponent = () => <div>Home</div>

export const App = () => (
  <Router>
    <Home path="/" />
    <Login path="/auth/login" />
  </Router>
)
