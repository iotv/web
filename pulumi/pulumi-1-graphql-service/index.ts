import * as pulumi from '@pulumi/pulumi'
import * as aws from '@pulumi/aws'
import {ServiceLambdaFunction} from './src/service'
import {HttpService} from './src/http-service/service'

const config = new pulumi.Config('pulumi-1-graphql-service')
const domainStack = new pulumi.StackReference(config.require('codeDeployStack'))

const graphqlLambda = new ServiceLambdaFunction('graphql', {
  handler: 'dist/src/handler.handleGraphQL',
  runtime: aws.lambda.NodeJS8d10Runtime,
  s3Bucket: domainStack.getOutput('bucketName'),
  s3Key: config.require('graphql'),
})

const graphqlPreflightLambda = new ServiceLambdaFunction('preflightGraphQL', {
  handler: 'dist/src/handler.handleCorsPreflight',
  runtime: aws.lambda.NodeJS8d10Runtime,
  s3Bucket: domainStack.getOutput('bucketName'),
  s3Key: config.require('graphql'),
})

const createPasswordHashLambda = new ServiceLambdaFunction(
  'createPasswordHash',
  {
    handler: 'create-password-hash',
    runtime: aws.lambda.Go1dxRuntime,
    s3Bucket: domainStack.getOutput('bucketName'),
    s3Key: config.require('createPasswordHash'),
  },
)

const validatePasswordHashLambda = new ServiceLambdaFunction(
  'validatePasswordHash',
  {
    handler: 'validate-password-hash',
    runtime: aws.lambda.Go1dxRuntime,
    s3Bucket: domainStack.getOutput('bucketName'),
    s3Key: config.require('validatePasswordHash'),
  },
)

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
