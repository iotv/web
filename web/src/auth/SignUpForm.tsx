import React, {FunctionComponent} from 'react'
import {useMutation} from 'react-apollo-hooks'
import {ErrorMessage, Field, Formik, Form} from 'formik'
import * as Yup from 'yup'
import gql from 'graphql-tag.macro'
import get from 'lodash/get'

import {Button} from '../components/Button'

const CREATE_USER_WITH_PASSWORD = gql`
  mutation createUserWithPassword(
    $email: String!
    $password: String!
    $userName: String!
  ) {
    createUserWithPassword(
      email: $email
      password: $password
      userName: $userName
    ) {
      user {
        id
      }
      token
    }
  }
`

const SignUpSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email address')
    .required('Required'),
  password: Yup.string()
    .min(8, 'Must be 8 or more characters')
    .required('Required'),
  userName: Yup.string()
    .max(32)
    .min(4)
    .required('Required'),
})

export const SignUpForm: FunctionComponent = props => {
  const signUp = useMutation(CREATE_USER_WITH_PASSWORD)
  return (
    <Formik
      initialValues={{email: '', password: '', userName: ''}}
      validationSchema={SignUpSchema}
      onSubmit={({email, password, userName}, {setSubmitting, setError}) => {
        signUp({variables: {email, password, userName}}).then(data => {
          alert(get(data, 'data.createUserWithPassword.token'))
        })
      }}
    >
      {({isSubmitting}) => (
        <Form>
          <div>
            <label htmlFor="email">Email</label>
            <Field type="email" name="email" />
            <ErrorMessage name="email" />
          </div>

          <div>
            <label htmlFor="password">Password</label>
            <Field type="password" name="password" />
            <ErrorMessage name="password" />
          </div>
          <Button disabled={isSubmitting}>Sign Up</Button>
        </Form>
      )}
    </Formik>
  )
}
