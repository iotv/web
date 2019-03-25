import * as pulumi from '@pulumi/pulumi'
import * as aws from '@pulumi/aws'

import {HttpServiceResourceConfig, HttpServiceResourceMap} from './types'
import {HttpServiceMethodIntegration} from './service-method-integration'

type RestServiceResourceArgs = aws.apigateway.ResourceArgs & {
  children?: HttpServiceResourceMap
  config: HttpServiceResourceConfig
}

export class HttpServiceResource extends pulumi.ComponentResource {
  public readonly rootApiGatewayResource: aws.apigateway.Resource
  public readonly methodIntegrations: HttpServiceMethodIntegration[]
  public readonly childResources: pulumi.Output<HttpServiceResource>[]

  constructor(
    name: string,
    args: RestServiceResourceArgs,
    opts?: pulumi.ResourceOptions,
  ) {
    super('iotv:HttpServiceResource', name, args, opts)
    this.rootApiGatewayResource = new aws.apigateway.Resource(
      `${name}`,
      {restApi: args.restApi, parentId: args.parentId, pathPart: args.pathPart},
      {parent: this},
    )

    this.methodIntegrations = Object.keys(args.config.methods).map(
      httpMethod =>
        new HttpServiceMethodIntegration(
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
      childResources: this.childResources,
      methodIntegrations: this.methodIntegrations,
    })
  }
}
