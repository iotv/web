import React, {FunctionComponent} from 'react'

import {HypeMainHeader} from './components/HypeMainHeader'
import {HypeSubHeader} from './components/HypeSubHeader'
import {useMutation} from 'react-apollo-hooks'
import gql from 'graphql-tag'
import {Input, getFormikClassName} from './components/Input'
import {Button} from './components/Button'
import {Formik, Form, Field, FieldProps} from 'formik'
import * as Yup from 'yup'

const APPLY_FOR_BETA = gql`
  mutation applyForBeta($email: String!) {
    applyForBeta(email: $email)
  }
`

const betaSignupSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email address')
    .required('Required'),
})

export const HypePageView: FunctionComponent = props => {
  const applyForBeta = useMutation(APPLY_FOR_BETA)
  return (
    <div className={'flex flex-col min-h-screen'}>
      <div className={'bg-gray-800 h-12'}>
        <span
          className={
            'text-gray-300 text-3xl m-3 font-mono font-extrabold italic'
          }
        >
          iotv
        </span>
      </div>
      <div
        className={
          'bg-gray-900 flex flex-grow flex-col items-center justify-around'
        }
      >
        <div className={'flex flex-col items-center content-center max-w-md'}>
          <HypeMainHeader className={'text-center'}>
            Video By You
          </HypeMainHeader>
          <HypeSubHeader className={'text-center'}>
            Stream. Edit. Remix. Collab.
          </HypeSubHeader>
          <Formik
            initialValues={{email: ''}}
            validationSchema={betaSignupSchema}
            onSubmit={({email}, {setSubmitting, setError}) => {
              applyForBeta({variables: {email}})
            }}
          >
            {({isSubmitting}) => (
              <Form className={'flex flex-col'}>
                <Field name="email">
                  {(props: FieldProps) => (
                    <Input
                      className={`${getFormikClassName(props)} mb-4 mt-4`}
                      {...props.field}
                      placeholder="Email"
                      type="email"
                    />
                  )}
                </Field>
                <Button>Sign up for the beta</Button>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  )
}
