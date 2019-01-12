jsx
import {jsx, css} from '@emotion/core'
import * as React from 'react'

export const App = () => (
  <div className="container mx-auto">
    <h1
      className="my-2"
      css={css`
        color: hotpink;
      `}
    >
      iotv
    </h1>
    Welcome to our site on the World Wide Web aka the "Information Superhighway"
  </div>
)
