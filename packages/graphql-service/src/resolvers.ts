import * as AWS from 'aws-sdk'
import cuid from 'cuid'
import {GraphQLFieldResolver} from 'graphql'
import * as Yup from 'yup'

export const signUpWithEmailAndPassword: GraphQLFieldResolver<
  any,
  any
> = async (root, {email, inviteToken, password, userName}) => {
  const db = new AWS.DynamoDB()

  await Yup.object({
    email: Yup.string()
      .email()
      .required(),
    password: Yup.string()
      .min(8)
      .required(),
    userName: Yup.string()
      .min(5)
      .max(24)
      .required(),
  }).validate({
    email,
    password,
    userName,
  })

  const lambda = new AWS.Lambda()
  const emailAuthenticationId = cuid()
  const createPasswordResponse = await lambda
    .invoke({
      FunctionName: 'createPasswordHash-ca0dc85',
      Payload: JSON.stringify({password}),
    })
    .promise()
  const {passwordHash} = JSON.parse(createPasswordResponse.Payload as string)
  const userId = cuid()

  await db
    .transactWriteItems({
      TransactItems: [
        {
          Put: {
            ConditionExpression: 'attribute_not_exists(EmailAuthenticationId)',
            Item: {
              Email: {S: email},
              EmailAuthenticationId: {S: emailAuthenticationId},
              HashedPassword: {S: passwordHash},
              UserId: {S: userId},
            },
            TableName: 'EmailAuthentications-dev-31915e6',
          },
        },
        {
          Put: {
            ConditionExpression: 'attribute_not_exists(Email)',
            Item: {
              Email: {S: email},
              EmailAuthenticationId: {S: emailAuthenticationId},
            },
            TableName: 'EmailAuthentications-devEmailUniqueIndex-1c47cd5',
          },
        },
        {
          Put: {
            ConditionExpression: 'attribute_not_exists(UserId)',
            Item: {
              EmailAuthenticationId: {S: emailAuthenticationId},
              UserId: {S: userId},
            },
            TableName: 'EmailAuthentications-devUserIdUniqueIndex-4b68b3c',
          },
        },
        {
          Put: {
            ConditionExpression: 'attribute_not_exists(UserId)',
            Item: {
              Email: {S: email},
              UserId: {S: userId},
              UserName: {S: userName},
            },
            TableName: 'Users-dev-2f5fdd5',
          },
        },
        {
          Put: {
            ConditionExpression: 'attribute_not_exists(Email)',
            Item: {
              Email: {S: email},
              UserId: {S: userId},
            },
            TableName: 'Users-devEmailUniqueIndex-c21f045',
          },
        },
        {
          Put: {
            ConditionExpression: 'attribute_not_exists(UserName)',
            Item: {
              UserId: {S: userId},
              UserName: {S: userName},
            },
            TableName: 'Users-devUserNameUniqueIndex-162761c',
          },
        },
        {
          Delete: {
            ConditionExpression: 'InviteToken = :InviteToken',
            ExpressionAttributeValues: {
              ':InviteToken': {
                S: inviteToken,
              },
            },
            Key: {
              Email: {S: email},
            },
            TableName: 'BetaInvites-dev-02f6f10',
          },
        },
      ],
    })
    .promise()

  return {
    token: '',
    user: {},
  }
}

export const applyForBeta: GraphQLFieldResolver<any, any> = async (
  root,
  {email},
) => {
  const db = new AWS.DynamoDB()
  await Yup.string()
    .email()
    .validate(email)
  await db
    .transactWriteItems({
      TransactItems: [
        {
          Put: {
            ConditionExpression: 'attribute_not_exists(Email)',
            Item: {
              Email: {S: email},
            },
            TableName: 'BetaApplications-dev-ee01dc8',
          },
        },
      ],
    })
    .promise()
  // FIXME: handle cases when it doesn't work
  return true
}
