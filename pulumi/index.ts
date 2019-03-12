import * as pulumi from '@pulumi/pulumi'
import {ServiceLambdaFunction} from './src/service'
import {HttpService} from './src/http-service/service'

export {authentications, emailAuthentications, users} from './src/users'

export const graphqlLambdaFunction = new ServiceLambdaFunction(
  `GraphQL-${pulumi.getStack()}`,
  {},
)

export const mainApiService = new HttpService(`MainApi-${pulumi.getStack()}`, {
  description: 'The main REST API',
  resources: {
    graphql: {
      methods: {
        POST: {
          lambda: graphqlLambdaFunction,
        },
      },
    },
  },
})
