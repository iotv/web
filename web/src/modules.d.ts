declare module 'graphql-tag.macro'

import {Attributes} from 'react'

declare module 'react' {
  interface Attributes {
    path?: string
  }
}
