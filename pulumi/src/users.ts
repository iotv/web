import * as pulumi from '@pulumi/pulumi'

import {DynamoDB} from './kv-database/database'

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
