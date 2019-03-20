type Maybe<T> = T | null
export type Scalars = {
  ID: string
  String: string
  Boolean: boolean
  Int: number
  Float: number
}

export type Mutation = {
  createUserWithPassword: UserAuthContainer
  loginWithEmailAndPassword: UserAuthContainer
}

export type MutationCreateUserWithPasswordArgs = {
  email: Scalars['String']
  password: Scalars['String']
  userName: Scalars['String']
}

export type MutationLoginWithEmailAndPasswordArgs = {
  email: Scalars['String']
  password: Scalars['String']
}

export type Query = {
  me: User
}

export type User = {
  id: Scalars['ID']
  email: Scalars['String']
  isEmailConfirmed: Scalars['Boolean']
  realName?: Maybe<Scalars['String']>
  userName: Scalars['String']
}

export type UserAuthContainer = {
  token: Scalars['String']
  user: User
}

import {GraphQLResolveInfo} from 'graphql'

export type ArrayOrIterable<T> = Array<T> | Iterable<T>

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo,
) => Promise<TResult> | TResult

export type StitchingResolver<TResult, TParent, TContext, TArgs> = {
  fragment: string
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>
}

export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> =
  | ResolverFn<TResult, TParent, TContext, TArgs>
  | StitchingResolver<TResult, TParent, TContext, TArgs>

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo,
) => AsyncIterator<TResult> | Promise<AsyncIterator<TResult>>

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo,
) => TResult | Promise<TResult>

export interface ISubscriptionResolverObject<
  TResult,
  TParent,
  TContext,
  TArgs
> {
  subscribe: SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs>
  resolve?: SubscriptionResolveFn<TResult, TParent, TContext, TArgs>
}

export type SubscriptionResolver<
  TResult,
  TParent = {},
  TContext = {},
  TArgs = {}
> =
  | ((
      ...args: any[]
    ) => ISubscriptionResolverObject<TResult, TParent, TContext, TArgs>)
  | ISubscriptionResolverObject<TResult, TParent, TContext, TArgs>

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo,
) => Maybe<TTypes>

export type NextResolverFn<T> = () => Promise<T>

export type DirectiveResolverFn<
  TResult = {},
  TParent = {},
  TContext = {},
  TArgs = {}
> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo,
) => TResult | Promise<TResult>

export type MutationResolvers<Context = any, ParentType = Mutation> = {
  createUserWithPassword?: Resolver<
    UserAuthContainer,
    ParentType,
    Context,
    MutationCreateUserWithPasswordArgs
  >
  loginWithEmailAndPassword?: Resolver<
    UserAuthContainer,
    ParentType,
    Context,
    MutationLoginWithEmailAndPasswordArgs
  >
}

export type QueryResolvers<Context = any, ParentType = Query> = {
  me?: Resolver<User, ParentType, Context>
}

export type UserResolvers<Context = any, ParentType = User> = {
  id?: Resolver<Scalars['ID'], ParentType, Context>
  email?: Resolver<Scalars['String'], ParentType, Context>
  isEmailConfirmed?: Resolver<Scalars['Boolean'], ParentType, Context>
  realName?: Resolver<Maybe<Scalars['String']>, ParentType, Context>
  userName?: Resolver<Scalars['String'], ParentType, Context>
}

export type UserAuthContainerResolvers<
  Context = any,
  ParentType = UserAuthContainer
> = {
  token?: Resolver<Scalars['String'], ParentType, Context>
  user?: Resolver<User, ParentType, Context>
}

export type IResolvers<Context = any> = {
  Mutation?: MutationResolvers<Context>
  Query?: QueryResolvers<Context>
  User?: UserResolvers<Context>
  UserAuthContainer?: UserAuthContainerResolvers<Context>
}

export type IDirectiveResolvers<Context = any> = {}
