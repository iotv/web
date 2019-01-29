import React, {FunctionComponent} from 'react'
import {useMutation} from 'react-apollo-hooks'
import {Field, FieldProps, Formik, Form} from 'formik'
import * as Yup from 'yup'
import gql from 'graphql-tag.macro'
import get from 'lodash/get'

import {Button} from '../components/Button'
import {FormErrorMessage} from '../components/FormErrorMessage'
import {FormLabel} from '../components/FormLabel'
import {Input, getFormikClassName} from '../components/Input'

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
    .max(32, 'Must be 4-32 characters')
    .min(4, 'Must be 4-32 characters')
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
        <Form className={'p-8 bg-white mb-6 rounded-lg shadow-lg'}>
          <div className={'mb-4'}>
            <FormLabel htmlFor="email">Email</FormLabel>
            <Field name="email">
              {(props: FieldProps) => (
                <Input
                  className={getFormikClassName(props)}
                  {...props.field}
                  type="email"
                />
              )}
            </Field>
            <FormErrorMessage name="email" />
          </div>

          <div className={'mb-4'}>
            <FormLabel htmlFor="userName">User Name</FormLabel>
            <Field name="userName">
              {(props: FieldProps) => (
                <Input className={getFormikClassName(props)} {...props.field} />
              )}
            </Field>
            <FormErrorMessage name="userName" />
          </div>

          <div className={'mb-4'}>
            <FormLabel htmlFor="password">Password</FormLabel>
            <Field name="password">
              {(props: FieldProps) => (
                <Input
                  className={getFormikClassName(props)}
                  {...props.field}
                  type="password"
                />
              )}
            </Field>
            <FormErrorMessage name="password" />
          </div>

          <Button disabled={isSubmitting}>Sign Up</Button>
        </Form>
      )}
    </Formik>
  )
}
