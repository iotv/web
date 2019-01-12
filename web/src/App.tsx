import React, {FunctionComponent} from 'react'
import {Router} from '@reach/router'

const Home: FunctionComponent<{path?: string}> = () => <div>Home</div>

export const App = () => (
  <div>
    <Router>
      <Home path="/" />
    </Router>
  </div>
)
