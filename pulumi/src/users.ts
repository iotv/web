import * as pulumi from '@pulumi/pulumi'
import * as aws from '@pulumi/aws'
import {flatten, getOr} from 'lodash/fp'

type DynamoDBArgs = {
  hashKey: string
  uniqueKeys?: string[]
  globalSecondaryIndices?: string[]
}

class DynamoDB extends pulumi.ComponentResource {
  public readonly mainTable: pulumi.Output<AutoscalingDynamoDBTable>
  public readonly uniqueKeyTables: pulumi.Output<AutoscalingDynamoDBTable>[]
  public readonly readWriteAccessPolicy: pulumi.Output<aws.iam.Policy>

  constructor(
    mainTableName: string,
    args: DynamoDBArgs,
    opts?: pulumi.ResourceOptions,
  ) {
    super('iotv:DynamoDB', mainTableName, {}, opts)

    this.mainTable = pulumi.output(mainTableName).apply(
      name =>
        new AutoscalingDynamoDBTable(
          name,
          {
            hashKey: args.hashKey,
            globalSecondaryIndices: args.globalSecondaryIndices,
          },
          {parent: this},
        ),
    )
    this.uniqueKeyTables = [...getOr([], 'uniqueKeys', args)!].map(key =>
      pulumi
        .output(key)
        .apply(
          hashKey =>
            new AutoscalingDynamoDBTable(
              `${mainTableName}${hashKey}UniqueIndex`,
              {hashKey},
              {parent: this},
            ),
        ),
    )

    this.readWriteAccessPolicy = pulumi
      .all([
        this.mainTable.apply(it => it.table.arn),
        ...this.uniqueKeyTables.map(uniqueKeyTable =>
          uniqueKeyTable.apply(it => it.table.arn),
        ),
      ])
      .apply(
        tables =>
          new aws.iam.Policy(
            `${mainTableName}-RW`,
            {
              description: 'Allow DynamoDB access to Users',
              policy: JSON.stringify({
                Version: '2012-10-17',
                Statement: [
                  {
                    Effect: 'Allow',
                    Action: [
                      'dynamodb:PutItem',
                      'dynamodb:GetItem',
                      'dynamodb:Scan',
                      'dynamodb:Query',
                      'dynamodb:UpdateItem',
                    ],
                    Resource: flatten(
                      tables.map(table => [`${table}`, `${table}/index/*`]),
                    ),
                  },
                ],
              }),
            },
            {parent: this},
          ),
      )

    this.registerOutputs({
      mainTable: this.mainTable,
      uniqueKeyTables: this.uniqueKeyTables,
      readWriteAccessPolicy: this.readWriteAccessPolicy,
    })
  }
}

type AutoScalingDynamoDBTableArgs = {
  hashKey: string
  globalSecondaryIndices?: string[]
}

class AutoscalingDynamoDBTable extends pulumi.ComponentResource {
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

type DynamoDBAutoscalingArgs = {
  minCapacity: number
  maxCapacity: number
  targetValue: number
  tableName: string
  globalSecondaryIndexNames?: string[]
}
const DefaultDynamoDBAutoscalingArgs = {
  minCapacity: 1,
  maxCapacity: 10,
  targetValue: 70,
}

class DynamoDBAutoscaling extends pulumi.ComponentResource {
  public readonly appautoscalingPolicies: aws.appautoscaling.Policy[]
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
          .map(({scalableDimensionSuffix, predefinedMetricType}) => ({
            target: new aws.appautoscaling.Target(
              `${resourceId}${scalableDimensionSuffix}`,
              {
                minCapacity: args.minCapacity,
                maxCapacity: args.maxCapacity,
                resourceId,
                scalableDimension: `${scalableDimensionPrefix}${scalableDimensionSuffix}`,
                serviceNamespace: 'dynamodb',
              },
              {parent: this},
            ),
            policy: new aws.appautoscaling.Policy(
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
          }))
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

export const authentications = new DynamoDB(
  `Authentications-${pulumi.getStack()}`,
  {
    hashKey: 'AuthenticationId',
    uniqueKeys: ['EmailAuthenticationId'],
    globalSecondaryIndices: ['UserId'],
  },
)
export const emailAuthentications = new DynamoDB(
  `EmailAuthentications-${pulumi.getStack()}`,
  {hashKey: 'EmailAuthenticationId', uniqueKeys: ['Email', 'UserId']},
)
export const users = new DynamoDB(`Users-${pulumi.getStack()}`, {
  hashKey: 'UserId',
  uniqueKeys: ['Email', 'UserName'],
})
