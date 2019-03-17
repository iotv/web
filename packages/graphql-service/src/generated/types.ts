export type Maybe<T> = T | null

// ====================================================
// Types
// ====================================================

export interface Query {
  me: User
}

export interface User {
  id: string

  email: string

  isEmailConfirmed: boolean

  realName?: Maybe<string>

  userName: string
}

export interface Mutation {
  /** createSourceVideo: SourceVideo! */
  createUserWithPassword: UserAuthContainer

  loginWithEmailAndPassword: UserAuthContainer
}

export interface UserAuthContainer {
  token: string

  user: User
}

// ====================================================
// Arguments
// ====================================================

export interface CreateUserWithPasswordMutationArgs {
  email: string

  password: string

  userName: string
}
export interface LoginWithEmailAndPasswordMutationArgs {
  email: string

  password: string
}
