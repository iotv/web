import * as pulumi from '@pulumi/pulumi'
import * as aws from '@pulumi/aws'

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
    DELETE?: {}
    GET?: {}
    HEAD?: {}
    OPTIONS?: {}
    PATCH?: {}
    POST?: {}
    PUT?: {}
  }
}

class Service extends pulumi.ComponentResource {
  public readonly apiGatwayRestApi: aws.apigateway.RestApi
  public readonly serviceResources: pulumi.Output<ServiceResource>[]
  public readonly lambdaFunctions: aws.lambda.Function[]

  constructor(name: string, args: ServiceArgs, opts?: pulumi.ResourceOptions) {
    super('iotv:Service', name, args, opts)
    this.apiGatwayRestApi = new aws.apigateway.RestApi(
      `${name}`,
      {description: args.description},
      {parent: this},
    )

    this.serviceResources = Object.keys(args.resources).map(pathPart =>
      this.apiGatwayRestApi.rootResourceId.apply(
        parentId =>
          new ServiceResource(
            `${name}${pathPart}`,
            {
              parentId,
              restApi: this.apiGatwayRestApi,
              pathPart,
              config: args.resources[pathPart],
            },
            {parent: this},
          ),
      ),
    )

    this.registerOutputs({
      apiGatewayRestApi: this.apiGatwayRestApi,
      serviceResources: this.serviceResources,
    })
  }
}

type ServiceResourceArgs = aws.apigateway.ResourceArgs & {
  children?: ServiceResourceMap
  config: ServiceResourceConfig
}

class ServiceResource extends pulumi.ComponentResource {
  public readonly rootApiGatewayResource: aws.apigateway.Resource
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

    this.apiGatewayMethods = Object.keys(args.config.methods).map(httpMethod =>
      this.rootApiGatewayResource.id.apply(
        resourceId =>
          new aws.apigateway.Method(
            `${name}${httpMethod}`,
            {
              httpMethod,
              restApi: args.restApi,
              authorization: 'NONE',
              resourceId,
            },
            {parent: this},
          ),
      ),
    )

    this.registerOutputs({
      rootApiGatewayResource: this.rootApiGatewayResource,
      apiGatewayMethods: this.apiGatewayMethods,
      childResources: this.childResources,
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

export const graphqlLambdaFunction = new ServiceLambdaFunction(
  `GraphQL-${pulumi.getStack()}`,
  {},
)

export const mainApiService = new Service(`MainApi-${pulumi.getStack()}`, {
  description: 'The main REST API',
  resources: {
    graphql: {
      methods: {
        POST: {},
      },
    },
  },
})
