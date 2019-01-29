import React, {FunctionComponent} from 'react'
import {ErrorMessage} from 'formik'

export type Props = {
  name: string
}

export const FormErrorMessage: FunctionComponent<Props> = props => (
  <p className={'m-1 text-red text-xs italic'}>
    <ErrorMessage name={props.name} />
  </p>
)
