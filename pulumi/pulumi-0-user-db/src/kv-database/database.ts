import * as pulumi from '@pulumi/pulumi'
import * as aws from '@pulumi/aws'
import {flatten, getOr} from 'lodash/fp'

import {DynamoDBArgs} from './types'
import {AutoscalingDynamoDBTable} from './autoscaling-table'

export class DynamoDB extends pulumi.ComponentResource {
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
                      'dynamodb:DeleteItem',
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
