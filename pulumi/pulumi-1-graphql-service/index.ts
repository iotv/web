import * as pulumi from '@pulumi/pulumi'
import {ServiceLambdaFunction} from './src/service'
import {HttpService} from './src/http-service/service'

const graphqlLambda = new ServiceLambdaFunction('graphql', {})

const httpService = pulumi.output(graphqlLambda).apply(
  graphqlLambda =>
    new HttpService('graphql-service', {
      description: '',
      resources: {
        graphql: {
          methods: {
            POST: {
              lambda: graphqlLambda,
            },
          },
        },
      },
    }),
)

export const restApiId = httpService.apply(
  httpService => httpService.apiGatewayRestApi.id,
)
