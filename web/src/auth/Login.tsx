import React, {FunctionComponent, useState} from 'react'
import {useMutation} from 'react-apollo-hooks'
import {ErrorMessage, Field, Formik, Form} from 'formik'
import gql from 'graphql-tag'
import get from 'lodash/get'

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

const Login: FunctionComponent<{}> = () => {
  const login = useMutation(LOGIN_WITH_EMAIL_AND_PASSWORD)

  return (
    <Formik
      initialValues={{email: '', password: ''}}
      validate={({email, password}) => {
        let errors: {email?: string; password?: string} = {}
        if (!email) {
          errors.email = 'Required'
        } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)) {
          errors.email = 'Invalid email address'
        }

        if (!password) {
          errors.password = 'Required'
        }
        return errors
      }}
      onSubmit={({email, password}, {setSubmitting, setError}) => {
        login({variables: {email, password}}).then(data => {
          alert(get(data, 'data.loginWithEmailAndPassword.token'))
        })
      }}
    >
      {({isSubmitting}) => (
        <Form>
          <Field type="email" name="email" />
          <ErrorMessage name="email">{msg => <div>{msg}</div>}</ErrorMessage>
          <Field type="password" name="password" />
          <ErrorMessage name="password">{msg => <div>{msg}</div>}</ErrorMessage>
          <button type="submit" disabled={isSubmitting}>
            Submit
          </button>
        </Form>
      )}
    </Formik>
  )
}

export default Login
