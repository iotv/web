import {ApolloServer, gql} from 'apollo-server-lambda'

const resolvers = {}

const typeDefs = gql`
type Query {
  me: User!
}

type Mutation {
  #createSourceVideo: SourceVideo!
  createUserWithPassword(
      email: String!
      password: String!
      userName: String!
  ): UserAuthContainer!
  loginWithEmailAndPassword(
      email: String!
      password: String!
  ): UserAuthContainer!
}

// type SourceVideo {
//   id: ID!
//   isFullyUploaded: Boolean!
//   ownerUser: User
//   uploadUrl: String
//   downloadUrl: String
// }

type User {
  id: ID!
  email: String!
  isEmailConfirmed: Boolean!
  realName: String
  userName: String!
  #sourceVideos: [SourceVideo!]!
}

type UserAuthContainer {
  token: String!
  user: User!
}
`

const server = new ApolloServer({typeDefs, resolvers})

server.createHandler()
