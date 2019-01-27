import React, {FunctionComponent} from 'react'
import {Router} from '@reach/router'

import {Login} from './auth/Login'
import {HypePageView} from './HypePageView'

export const App = () => (
  <Router>
    <HypePageView path="/" />
    <Login path="/auth/login" />
  </Router>
)
