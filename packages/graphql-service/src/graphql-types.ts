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

export const User = new GraphQLObjectType({
  name: 'User',
  fields: {
    id: {
      type: GraphQLNonNull(GraphQLID),
    },
  },
})

export const UserAuthContainer = new GraphQLObjectType({
  name: 'AuthContainer',
  fields: {
    token: {
      type: GraphQLNonNull(GraphQLString),
    },
    user: {
      type: GraphQLNonNull(User),
    },
  },
})
