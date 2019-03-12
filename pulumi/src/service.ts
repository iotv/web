import * as pulumi from '@pulumi/pulumi'
import * as aws from '@pulumi/aws'
import {RestApi} from '@pulumi/aws/apigateway'

type ServiceArgs = {
  description: string
  resources: ServiceResourceMap
}

type ServiceResourceMap = {
  [pathPart: string]: ServiceResourceConfig
}

type ServiceResourceConfig = {
  children?: ServiceResourceMap
  methods: {
    DELETE?: ServiceResourceMethod
    GET?: ServiceResourceMethod
    HEAD?: ServiceResourceMethod
    OPTIONS?: ServiceResourceMethod
    PATCH?: ServiceResourceMethod
    POST?: ServiceResourceMethod
    PUT?: ServiceResourceMethod
  }
}

type ServiceResourceMethod = {
  lambda: pulumi.Input<ServiceLambdaFunction>
}

class Service extends pulumi.ComponentResource {
  public readonly apiGatewayRestApi: aws.apigateway.RestApi
  public readonly serviceResources: pulumi.Output<ServiceResource>[]
  public readonly apiGatewayDeployment: pulumi.Output<aws.apigateway.Deployment>

  constructor(name: string, args: ServiceArgs, opts?: pulumi.ResourceOptions) {
    super('iotv:Service', name, args, opts)
    this.apiGatewayRestApi = new aws.apigateway.RestApi(
      `${name}`,
      {description: args.description},
      {parent: this},
    )

    this.serviceResources = Object.keys(args.resources).map(pathPart =>
      this.apiGatewayRestApi.rootResourceId.apply(
        parentId =>
          new ServiceResource(
            `${name}${pathPart}`,
            {
              parentId,
              restApi: this.apiGatewayRestApi,
              pathPart,
              config: args.resources[pathPart],
            },
            {parent: this},
          ),
      ),
    )

    this.apiGatewayDeployment = pulumi.all(this.serviceResources).apply(
      () =>
        new aws.apigateway.Deployment(
          name,
          {
            restApi: this.apiGatewayRestApi,
            stageName: 'master',
          },
          {parent: this},
        ),
    )

    this.registerOutputs({
      apiGatewayRestApi: this.apiGatewayRestApi,
      serviceResources: this.serviceResources,
      apiGatewayDeployment: this.apiGatewayDeployment,
    })
  }
}

type ServiceResourceArgs = aws.apigateway.ResourceArgs & {
  children?: ServiceResourceMap
  config: ServiceResourceConfig
}

class ServiceResource extends pulumi.ComponentResource {
  public readonly rootApiGatewayResource: aws.apigateway.Resource
  public readonly methodIntegrations: ServiceMethodIntegration[]
  public readonly apiGatewayMethods: pulumi.Output<aws.apigateway.Method>[]
  public readonly childResources: pulumi.Output<ServiceResource>[]

  constructor(
    name: string,
    args: ServiceResourceArgs,
    opts?: pulumi.ResourceOptions,
  ) {
    super('iotv:ServiceResource', name, args, opts)
    this.rootApiGatewayResource = new aws.apigateway.Resource(
      `${name}`,
      {restApi: args.restApi, parentId: args.parentId, pathPart: args.pathPart},
      {parent: this},
    )

    this.methodIntegrations = Object.keys(args.config.methods).map(
      httpMethod =>
        new ServiceMethodIntegration(
          `${name}${httpMethod}`,
          {
            httpMethod,
            lambda: args.config.methods[
              <
                'DELETE' | 'GET' | 'HEAD' | 'OPTIONS' | 'PATCH' | 'POST' | 'PUT'
              >httpMethod
            ]!.lambda,
            restApi: args.restApi,
            resource: this.rootApiGatewayResource,
          },
          {parent: this},
        ),
    )

    this.registerOutputs({
      rootApiGatewayResource: this.rootApiGatewayResource,
      apiGatewayMethods: this.apiGatewayMethods,
      childResources: this.childResources,
      methodIntegrations: this.methodIntegrations,
    })
  }
}

type ServiceLambdaFunctionArgs = {}

class ServiceLambdaFunction extends pulumi.ComponentResource {
  public readonly iamRole: aws.iam.Role
  public readonly lambdaFunction: pulumi.Output<aws.lambda.Function>
  public readonly cloudwatchLogsIamPolicy: pulumi.Output<aws.iam.Policy>
  public readonly cloudwatchLogGroup: pulumi.Output<aws.cloudwatch.LogGroup>
  public readonly cloudwatchLogsIamPolicyAtachment: pulumi.Output<
    aws.iam.PolicyAttachment
  >

  constructor(
    name: string,
    args: ServiceLambdaFunctionArgs,
    opts?: pulumi.ResourceOptions,
  ) {
    super('iotv:ServiceLambdaFunction', name, args, opts)

    this.iamRole = new aws.iam.Role(
      `${name}`,
      {
        assumeRolePolicy: {
          Version: '2012-10-17',
          Statement: [
            {
              Action: 'sts:AssumeRole',
              Effect: 'Allow',
              Principal: {
                Service: 'lambda.amazonaws.com',
              },
            },
          ],
        },
      },
      {parent: this},
    )

    this.lambdaFunction = this.iamRole.arn.apply(
      role =>
        new aws.lambda.Function(
          `${name}`,
          {
            runtime: aws.lambda.Go1dxRuntime,
            role,
            handler: 'graphql',
            code: new pulumi.asset.FileArchive('../bin/graphql.zip'),
            timeout: 5,
            memorySize: 1024,
          },
          {parent: this},
        ),
    )

    this.cloudwatchLogGroup = this.lambdaFunction.apply(lambdaFunction =>
      lambdaFunction.name.apply(
        lambdaName =>
          new aws.cloudwatch.LogGroup(
            lambdaName,
            {
              name: `/aws/lambda/${lambdaName}`,
              retentionInDays: 7,
            },
            {parent: this},
          ),
      ),
    )

    this.cloudwatchLogsIamPolicy = this.cloudwatchLogGroup.apply(
      cloudwatchLogGroup =>
        cloudwatchLogGroup.arn.apply(cloudwatchLogGroupArn => {
          const arn = cloudwatchLogGroupArn.substring(
            0,
            cloudwatchLogGroupArn.length - 2,
          )
          const policy: aws.iam.PolicyDocument = {
            Version: '2012-10-17',
            Statement: [
              {
                Action: ['logs:CreateLogStream', 'logs:PutLogEvents'],
                Effect: 'Allow',
                Resource: '*',
              },
            ],
          }
          return new aws.iam.Policy(
            `${name}`,
            {
              namePrefix: name,
              policy: JSON.stringify(policy),
            },
            {parent: this},
          )
        }),
    )

    this.cloudwatchLogsIamPolicyAtachment = this.cloudwatchLogsIamPolicy
      .apply(cloudwatchLogsIamPolicy => cloudwatchLogsIamPolicy.arn)
      .apply(
        policyArn =>
          new aws.iam.PolicyAttachment(
            `${name}`,
            {policyArn, roles: [this.iamRole]},
            {parent: this},
          ),
      )

    this.registerOutputs({
      iamRole: this.iamRole,
      lambdaFunction: this.lambdaFunction,
      cloudwatchLogsIamPolicy: this.cloudwatchLogsIamPolicy,
      cloudwatchLogGroup: this.cloudwatchLogGroup,
      cloudwatchLogsIamPolicyAtachment: this.cloudwatchLogsIamPolicyAtachment,
    })
  }
}

type ServiceMethodIntegrationArgs = {
  httpMethod: pulumi.Input<string>
  lambda: pulumi.Input<ServiceLambdaFunction>
  restApi: pulumi.Input<aws.apigateway.RestApi>
  resource: pulumi.Input<aws.apigateway.Resource>
}

class ServiceMethodIntegration extends pulumi.ComponentResource {
  public readonly apiGatewayMethod: pulumi.Output<aws.apigateway.Method>
  public readonly apiGatewayIntegration: pulumi.Output<
    aws.apigateway.Integration
  >
  public readonly lambdaPermission: pulumi.Output<aws.lambda.Permission>

  constructor(
    name: string,
    args: ServiceMethodIntegrationArgs,
    opts?: pulumi.ResourceOptions,
  ) {
    super('iotv:ServiceMethodIntegration', name, args, opts)

    this.apiGatewayMethod = pulumi
      .all([
        args.httpMethod,
        args.restApi,
        pulumi.output(args.resource).apply(resource => resource.id),
      ])
      .apply(
        ([httpMethod, restApi, resourceId]) =>
          new aws.apigateway.Method(
            name,
            {
              httpMethod,
              restApi,
              authorization: 'NONE',
              resourceId,
            },
            {parent: this},
          ),
      )

    this.apiGatewayIntegration = pulumi
      .all([
        aws.getRegion(),
        args.httpMethod,
        args.restApi,
        pulumi.output(args.resource).apply(resource => resource.id),
        pulumi
          .output(args.lambda)
          .apply(lambda => lambda.lambdaFunction.apply(fn => fn.arn)),
      ])
      .apply(
        ([{name: region}, httpMethod, restApi, resourceId, lambdaArn]) =>
          new aws.apigateway.Integration(
            name,
            {
              type: 'AWS_PROXY',
              httpMethod,
              integrationHttpMethod: 'POST',
              restApi,
              resourceId,
              uri: `arn:aws:apigateway:${region}:lambda:path/2015-03-31/functions/${lambdaArn}/invocations`,
            },
            {parent: this},
          ),
      )

    this.lambdaPermission = pulumi
      .all([
        aws.getRegion(),
        aws.getCallerIdentity(),
        pulumi.output(args.restApi).apply(restApi => restApi.id),
        args.httpMethod,
        pulumi.output(args.resource).apply(resource => resource.path),
        pulumi
          .output(args.lambda)
          .apply(lambda => lambda.lambdaFunction.apply(fn => fn.arn)),
      ])
      .apply(
        ([
          {name: region},
          {accountId},
          restApiId,
          httpMethod,
          resourcePath,
          lambdaArn,
        ]) =>
          new aws.lambda.Permission(
            name,
            {
              action: 'lambda:InvokeFunction',
              principal: 'apigateway.amazonaws.com',
              function: lambdaArn,
              sourceArn: `arn:aws:execute-api:${region}:${accountId}:${restApiId}/*/${httpMethod}${resourcePath}`,
            },
            {parent: this},
          ),
      )

    this.registerOutputs({
      apiGatewayMethod: this.apiGatewayMethod,
      apiGatewayIntegration: this.apiGatewayIntegration,
      lambdaPermission: this.lambdaPermission,
    })
  }
}

export const graphqlLambdaFunction = new ServiceLambdaFunction(
  `GraphQL-${pulumi.getStack()}`,
  {},
)

export const mainApiService = new Service(`MainApi-${pulumi.getStack()}`, {
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
