import * as pulumi from '@pulumi/pulumi'
import {ServiceLambdaFunction} from './src/service'
import {HttpService} from './src/http-service/service'

const config = new pulumi.Config('pulumi-1-graphql-service')
const domainStack = new pulumi.StackReference(config.require('codeDeployStack'))

const graphqlLambda = new ServiceLambdaFunction('graphql', {
  handler: 'main.handleGraphQL',
  s3Bucket: domainStack.getOutput('bucketName'),
  s3Key: config.require('graphql'),
})

const graphqlPreflightLambda = new ServiceLambdaFunction('preflightGraphQL', {
  handler: 'main.handleCorsPreflight',
  s3Bucket: domainStack.getOutput('bucketName'),
  s3Key: config.require('graphql'),
})

const httpService = pulumi
  .all([pulumi.output(graphqlLambda), pulumi.output(graphqlPreflightLambda)])
  .apply(
    ([graphqlLambda, graphqlPreflightLambda]) =>
      new HttpService('graphql-service', {
        description: '',
        resources: {
          graphql: {
            methods: {
              POST: {
                lambda: graphqlLambda,
              },
              OPTIONS: {
                lambda: graphqlPreflightLambda,
              },
            },
          },
        },
      }),
  )

export const restApiId = httpService.apply(
  httpService => httpService.apiGatewayRestApi.id,
)
