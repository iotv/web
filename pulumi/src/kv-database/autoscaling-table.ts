import * as pulumi from '@pulumi/pulumi'
import * as aws from '@pulumi/aws'
import {getOr} from 'lodash/fp'

import {AutoScalingDynamoDBTableArgs, DynamoDBAutoscalingArgs} from './types'

const DefaultDynamoDBAutoscalingArgs = {
  minCapacity: 1,
  maxCapacity: 10,
  targetValue: 70,
}

export class AutoscalingDynamoDBTable extends pulumi.ComponentResource {
  public readonly table: aws.dynamodb.Table
  public readonly autoscaling: pulumi.Output<DynamoDBAutoscaling>

  constructor(
    tableName: string,
    args: AutoScalingDynamoDBTableArgs,
    opts?: pulumi.ResourceOptions,
  ) {
    super('iotv:AutoscalingDynamoDBTable', tableName, {}, opts)

    this.table = new aws.dynamodb.Table(
      tableName,
      {
        attributes: [
          args.hashKey,
          ...getOr([], 'globalSecondaryIndices', args)!,
        ].map(name => ({name, type: 'S'})),
        globalSecondaryIndexes: [
          ...getOr([], 'globalSecondaryIndices', args)!,
        ].map(hashKey => ({
          readCapacity: 1,
          writeCapacity: 1,
          hashKey,
          name: `${hashKey}Index`,
          projectionType: 'KEYS_ONLY',
        })),
        hashKey: args.hashKey,
        readCapacity: 1,
        writeCapacity: 1,
      },
      {parent: this},
    )
    this.autoscaling = this.table.name.apply(
      tableName =>
        new DynamoDBAutoscaling(
          tableName,
          {
            ...DefaultDynamoDBAutoscalingArgs,
            tableName,
            globalSecondaryIndexNames: [
              ...getOr([], 'globalSecondaryIndices', args)!,
            ].map(name => `${name}Index`),
          },
          {parent: this},
        ),
    )

    this.registerOutputs({
      table: this.table,
      autoscaling: this.autoscaling,
    })
  }
}

class DynamoDBAutoscaling extends pulumi.ComponentResource {
  public readonly appautoscalingPolicies: pulumi.Output<
    aws.appautoscaling.Policy
  >[]
  public readonly appautoscalingTargets: aws.appautoscaling.Target[]

  constructor(
    name: string,
    args: DynamoDBAutoscalingArgs,
    opts?: pulumi.ResourceOptions,
  ) {
    super('iotv:DynamoDBAutoscaling', name, {}, opts)

    const resources = [
      {
        resourceId: `table/${args.tableName}`,
        scalableDimensionPrefix: 'dynamodb:table',
      },
      ...[...getOr([], 'globalSecondaryIndexNames', args)!].map(name => ({
        resourceId: `table/${args.tableName}/index/${name}`,
        scalableDimensionPrefix: 'dynamodb:index',
      })),
    ]
    const params = [
      {
        scalableDimensionSuffix: ':ReadCapacityUnits',
        predefinedMetricType: 'DynamoDBReadCapacityUtilization',
      },
      {
        scalableDimensionSuffix: ':WriteCapacityUnits',
        predefinedMetricType: 'DynamoDBWriteCapacityUtilization',
      },
    ]

    const {targets, policies} = resources
      .map(({resourceId, scalableDimensionPrefix}) =>
        params
          .map(({scalableDimensionSuffix, predefinedMetricType}) => {
            const target = new aws.appautoscaling.Target(
              `${resourceId}${scalableDimensionSuffix}`,
              {
                minCapacity: args.minCapacity,
                maxCapacity: args.maxCapacity,
                resourceId,
                scalableDimension: `${scalableDimensionPrefix}${scalableDimensionSuffix}`,
                serviceNamespace: 'dynamodb',
              },
              {parent: this},
            )
            const policy = target.id.apply(
              () =>
                new aws.appautoscaling.Policy(
                  `${resourceId}${scalableDimensionSuffix}`,
                  {
                    resourceId,
                    scalableDimension: `${scalableDimensionPrefix}${scalableDimensionSuffix}`,
                    serviceNamespace: 'dynamodb',
                    policyType: 'TargetTrackingScaling',
                    targetTrackingScalingPolicyConfiguration: {
                      predefinedMetricSpecification: {
                        predefinedMetricType,
                      },
                      targetValue: args.targetValue,
                    },
                  },
                  {parent: this},
                ),
            )
            return {target, policy}
          })
          .reduce(
            (acc, i) => ({
              targets: [...acc.targets, i.target],
              policies: [...acc.policies, i.policy],
            }),
            {targets: [], policies: []},
          ),
      )
      .reduce(
        (acc, i) => ({
          targets: [...acc.targets, ...i.targets],
          policies: [...acc.policies, ...i.policies],
        }),
        {targets: [], policies: []},
      )

    this.appautoscalingPolicies = policies
    this.appautoscalingTargets = targets

    this.registerOutputs({
      appautoscalingPolicies: this.appautoscalingPolicies,
      appautoscalingTargets: this.appautoscalingTargets,
    })
  }
}
