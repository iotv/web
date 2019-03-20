import {graphql, GraphQLSchema, GraphQLObjectType} from 'graphql'
import {APIGatewayProxyEvent, APIGatewayProxyResult, Context} from 'aws-lambda'

export async function handleGraphQL(
  event: APIGatewayProxyEvent,
  context: Context,
): Promise<APIGatewayProxyResult> {
  const result = graphql({
    schema: new GraphQLSchema({
      query: new GraphQLObjectType({
        name: 'RootQueryType',
        fields: {},
      }),
    }),
    source: '',
  })
  return {
    statusCode: 200,
    body: JSON.stringify(result),
  }
}
