import React, {FunctionComponent} from 'react'
import {useMutation} from 'react-apollo-hooks'
import {ErrorMessage, Field, Formik, Form} from 'formik'
import * as Yup from 'yup'
import gql from 'graphql-tag.macro'
import get from 'lodash/get'

import {Button} from '../components/Button'

const LOGIN_WITH_EMAIL_AND_PASSWORD = gql`
  mutation loginWithEmailAndPassword($email: String!, $password: String!) {
    loginWithEmailAndPassword(email: $email, password: $password) {
      user {
        id
      }
      token
    }
  }
`

const LoginSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email address')
    .required('Required'),
  password: Yup.string().required('Required'),
})

export const Login: FunctionComponent<{}> = () => {
  const login = useMutation(LOGIN_WITH_EMAIL_AND_PASSWORD)

  return (
    <Formik
      initialValues={{email: '', password: ''}}
      validationSchema={LoginSchema}
      onSubmit={({email, password}, {setSubmitting, setError}) => {
        login({variables: {email, password}}).then(data => {
          alert(get(data, 'data.loginWithEmailAndPassword.token'))
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
          <Button disabled={isSubmitting}>Login</Button>
        </Form>
      )}
    </Formik>
  )
}
