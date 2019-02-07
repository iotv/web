import * as pulumi from '@pulumi/pulumi'
import * as aws from '@pulumi/aws'
import {flatten, getOr, pick} from 'lodash/fp'

type DatabaseOptions = {
  uniqueKeys: string[]
  globalSecondaryIndices: string[]
}
function createDatabase(
  name: string,
  hashKey: string,
  options?: Partial<DatabaseOptions>,
): aws.dynamodb.Table[] {
  const mainTable = new aws.dynamodb.Table(name, {
    attributes: [
      hashKey,
      ...(options && options.globalSecondaryIndices
        ? options.globalSecondaryIndices
        : []),
    ].map(name => ({name, type: 'S'})),
    globalSecondaryIndexes: [
      ...(options && options.globalSecondaryIndices
        ? options.globalSecondaryIndices
        : []),
    ].map(hashKey => ({
      hashKey,
      name: `${hashKey}Index`,
      projectionType: 'KEY_ONLY',
    })),
    hashKey,
  })
  const uniqueKeyTables = [
    ...(options && options.uniqueKeys ? options.uniqueKeys : []),
  ].map(
    hashKey =>
      new aws.dynamodb.Table(`${name}${hashKey}UniqueKey`, {
        attributes: [{name: hashKey, type: 'S'}],
        hashKey,
      }),
  )
  createAppautoscalingForTable(name)
  uniqueKeyTables.map(table =>
    table.name.apply(name => createAppautoscalingForTable(name)),
  )
  return [mainTable, ...uniqueKeyTables]
}

function createAppautoscalingForTable(
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
            serviceNamespace: 'dyanmodb',
          },
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
        )
        return {target, policy}
      }),
    ),
  )
}

const tables = flatten([
  createDatabase(`Authentications-${pulumi.getStack()}`, 'AuthenticationId', {
    uniqueKeys: ['EmailAuthenticationId'],
    globalSecondaryIndices: ['UserId'],
  }),
  createDatabase(
    `EmailAuthentications-${pulumi.getStack()}`,
    'EmailAuthenticationId',
    {
      uniqueKeys: ['Email', 'UserId'],
    },
  ),
  createDatabase(`Users-${pulumi.getStack()}`, 'UserId', {
    uniqueKeys: ['Email', 'UserName'],
  }),
])
export const policy = new aws.iam.Policy('allowFullUsersDynamoAccess', {
  description: 'Allow DynamoDB access to Users',
  policy: JSON.stringify({
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
          tables.map(table => [`${table.arn}`, `${table.arn}/index/*`]),
        ),
      },
    ],
  }),
})
