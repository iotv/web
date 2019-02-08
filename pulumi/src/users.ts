import * as pulumi from '@pulumi/pulumi'
import * as aws from '@pulumi/aws'
import {flatten, getOr, pick} from 'lodash/fp'

type DynamoDBArgs = {
  hashKey: string
  uniqueKeys?: string[]
  globalSecondaryIndices?: string[]
}

type AutoScalingDynamoDBTableArgs = {
  hashKey: string
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

class AutoscalingDynamoDBTable extends pulumi.ComponentResource {
  public readonly table: aws.dynamodb.Table
  public readonly appautoscalingPolicies: pulumi.Output<
    aws.appautoscaling.Policy[]
  >
  public readonly appautoscalingTargets: pulumi.Output<
    aws.appautoscaling.Target[]
  >

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

    const appautoscaling = this.table.name.apply(name =>
      createAppautoscalingForTable(this.table, name),
    )
    this.appautoscalingTargets = appautoscaling.apply(appautoscaling =>
      appautoscaling.map(it => it.target),
    )
    this.appautoscalingPolicies = appautoscaling.apply(appautoscaling =>
      appautoscaling.map(it => it.policy),
    )

    this.registerOutputs({
      table: this.table,
      appautoscalingPolicies: this.appautoscalingPolicies,
      appautoscalingTargets: this.appautoscalingTargets,
    })
  }
}

function createAppautoscalingForTable(
  parent: pulumi.Resource,
  tableName: string,
  globalSecondaryIndices?: string[],
): {target: aws.appautoscaling.Target; policy: aws.appautoscaling.Policy}[] {
  const resourceIds = [
    `table/${tableName}`,
    ...(globalSecondaryIndices
      ? globalSecondaryIndices.map(
          index => `table/${tableName}/index/${index}Index`,
        )
      : []),
  ]
  const params = [
    {
      scalableDimension: 'dynamodb:table:ReadCapacityUnits',
      predefinedMetricType: 'DynamoDBReadCapacityUtilization',
    },
    {
      scalableDimension: 'dynamodb:table:WriteCapacityUnits',
      predefinedMetricType: 'DynamoDBWriteCapacityUtilization',
    },
  ]
  return flatten(
    resourceIds.map(resourceId =>
      params.map(({scalableDimension, predefinedMetricType}) => {
        const target = new aws.appautoscaling.Target(
          `${resourceId}-${scalableDimension}`,
          {
            minCapacity: 1,
            maxCapacity: 10,
            resourceId,
            scalableDimension,
            serviceNamespace: 'dynamodb',
          },
          {parent},
        )
        const policy = new aws.appautoscaling.Policy(
          `${resourceId}-${scalableDimension}`,
          {
            ...pick(
              ['resourceId', 'scalableDimension', 'serviceNamespace'],
              target,
            ),
            policyType: 'TargetTrackingScaling',
            targetTrackingScalingPolicyConfiguration: {
              predefinedMetricSpecification: {
                predefinedMetricType,
              },
              targetValue: 70,
            },
          },
          {parent},
        )
        return {target, policy}
      }),
    ),
  )
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
