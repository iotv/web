import React from 'react'
import {Router} from '@reach/router'

import {LoginForm} from './auth/LoginForm'
import {SignUpForm} from './auth/SignUpForm'
import {HypePageView} from './HypePageView'

export const App = () => (
  <Router>
    <HypePageView path="/" />
    <LoginForm path="/auth/login" />
    <SignUpForm path="/auth/signup" />
  </Router>
)
