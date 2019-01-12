import React from 'react'
import ReactDOM from 'react-dom'
import ApolloClient from 'apollo-boost'
import {ApolloProvider} from 'react-apollo-hooks'
import {App} from './App'
import * as serviceWorker from './serviceWorker'
import './tailwind.css'

const apolloClient = new ApolloClient({uri: process.env.REACT_APP_GRAPHQL_URL})

const AppWithProviders = () => (
  <ApolloProvider client={apolloClient}>
    <App />
  </ApolloProvider>
)

ReactDOM.render(<AppWithProviders />, document.getElementById('root'))

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister()
