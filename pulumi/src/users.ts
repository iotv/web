import * as pulumi from '@pulumi/pulumi'
import * as aws from '@pulumi/aws'
import {flatten, getOr, pick} from 'lodash/fp'

type Database = {
  mainTable: aws.dynamodb.Table
  uniqueKeyTables: aws.dynamodb.Table[]
}
type DatabaseOptions = {
  uniqueKeys: string[]
  globalSecondaryIndices: string[]
}
function createDatabase(
  name: string,
  hashKey: string,
  options?: Partial<DatabaseOptions>,
): Database {
  const mainTable = new aws.dynamodb.Table(name, {
    attributes: [hashKey, ...getOr([], 'globalSecondaryIndices', options)!].map(
      name => ({name, type: 'S'}),
    ),
    globalSecondaryIndexes: [
      ...getOr([], 'globalSecondaryIndices', options)!,
    ].map(hashKey => ({
      readCapacity: 1,
      writeCapacity: 1,
      hashKey,
      name: `${hashKey}Index`,
      projectionType: 'KEYS_ONLY',
    })),
    hashKey,
    readCapacity: 1,
    writeCapacity: 1,
  })
  const uniqueKeyTables = [...getOr([], 'uniqueKeys', options)!].map(
    hashKey =>
      new aws.dynamodb.Table(`${name}${hashKey}UniqueKey`, {
        attributes: [{name: hashKey, type: 'S'}],
        hashKey,
        readCapacity: 1,
        writeCapacity: 1,
      }),
  )
  mainTable.name.apply(name => createAppautoscalingForTable(name))
  uniqueKeyTables.map(table =>
    table.name.apply(name => createAppautoscalingForTable(name)),
  )
  return {
    mainTable,
    uniqueKeyTables,
  }
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
            serviceNamespace: 'dynamodb',
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

const authentications = createDatabase(
  `Authentications-${pulumi.getStack()}`,
  'AuthenticationId',
  {
    uniqueKeys: ['EmailAuthenticationId'],
    globalSecondaryIndices: ['UserId'],
  },
)
const emailAuthentications = createDatabase(
  `EmailAuthentications-${pulumi.getStack()}`,
  'EmailAuthenticationId',
  {
    uniqueKeys: ['Email', 'UserId'],
  },
)
const users = createDatabase(`Users-${pulumi.getStack()}`, 'UserId', {
  uniqueKeys: ['Email', 'UserName'],
})

const tableNames = [
  authentications.mainTable,
  ...authentications.uniqueKeyTables,
  emailAuthentications.mainTable,
  ...emailAuthentications.uniqueKeyTables,
  users.mainTable,
  ...users.uniqueKeyTables,
].map(table => table.arn)

export const policy = pulumi.all(tableNames).apply(
  tables =>
    new aws.iam.Policy('allowFullUsersDynamoAccess', {
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
    }),
)
