import {DynamoDB} from 'aws-sdk'
import {
  graphql,
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLFieldConfigMap,
  GraphQLString,
  GraphQLNonNull,
  GraphQLID,
  GraphQLBoolean,
} from 'graphql'
import {APIGatewayProxyEvent, APIGatewayProxyResult, Context} from 'aws-lambda'
import * as Yup from 'yup'

const userType = new GraphQLObjectType({
  name: 'User',
  fields: {
    id: {
      type: GraphQLNonNull(GraphQLID),
    },
  },
})

const queryFields: GraphQLFieldConfigMap<any, any> = {
  User: {
    type: userType,
    resolve: () => ({
      id: 'hola',
    }),
  },
}

const mutationFields: GraphQLFieldConfigMap<any, any> = {
  applyForBeta: {
    args: {
      email: {
        description: 'email with which to apply for beta.',
        type: GraphQLNonNull(GraphQLString),
      },
    },
    resolve: async (root, {email}) => {
      const db = new DynamoDB({region: 'us-east-1'})
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
    },
    type: GraphQLBoolean,
  },
}

export async function handleGraphQL(
  event: Partial<APIGatewayProxyEvent>,
  context: Partial<Context>,
): Promise<APIGatewayProxyResult> {
  const result = await graphql({
    schema: new GraphQLSchema({
      query: new GraphQLObjectType({
        name: 'RootQueryType',
        fields: queryFields,
      }),
      mutation: new GraphQLObjectType({
        name: 'RootMutationType',
        fields: mutationFields,
      }),
    }),
    source: JSON.parse(event.body).query,
  })
  return {
    statusCode: 200,
    body: JSON.stringify(result),
  }
}
