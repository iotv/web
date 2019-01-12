# iotv/web

Primary React repository for iotv

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app). You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

## Available Scripts

### `yarn start`

Runs the app in development mode. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### `yarn test`

Launches the test runner in interactive watch mode.

### `yarn build`

Builds the app for production to the `build` folder. It correctly bundles React in production mode and optimizes the build for the best performance. The build is minified and the filenames include the hashes.

## Primary Dependencies

### `react-app-rewired` & [`customize-cra`](https://github.com/arackaf/customize-cra)

Allows modification of underlying webpack configurations specified in `config-overrides.js` using a set of functions from the `customize-cra` module.

### [`tailwindcss`](https://github.com/tailwindcss/tailwindcss)

A utility-first CSS framework. Automatically loaded as a postcss plugin in `config-overrides.js`. `tailwind.js` contains tailwind configuration and `src/tailwind.css` (imported in `src/index.tsx`) enables usage via `className`.

See [https://nerdcave.com/tailwind-cheat-sheet](https://nerdcave.com/tailwind-cheat-sheet) for a searchable cheat sheet.

### [`emotion`](https://github.com/emotion-js/emotion)

A css-in-js library for managing component styles. Use `tailwind` for most styling, but `emotion` for customization of individual components.

There are a number of ways to use `emotion`, but the preferred style is to create full React components rather than using `emotion.styled`. This can be done using the `css` prop on any element:

```tsx
import React, {FunctionComponent} from 'react'
import {css} from '@emotion/core'

const Card: FunctionComponent = ({color, children}) => (
  <div
    css={css`
      color: ${color};
    `}
  >
    {children}
  </div>
)
```

### [`@reach/router`](https://github.com/reach/router)

A modern, accessibility-first router. Great for nesting routes that directly render `children`.

Note: Components that are rendered by a router should add `path?: string` to its props type to avoid a type error.

```js
import * as React from 'react'
import {Router} from '@reach/router'

type Props = {
  color: string
  path?: string
}

const Component: FunctionComponent<Props> = ({color}) => <p>Your chosen color is "{color}".</p>

export const App = () => (
  <div>
    <Router>
      <Component color="blue" path="colors/blue" />
      <Component color="red" path="colors/red" />
    </Router>
  </div>
)
```
