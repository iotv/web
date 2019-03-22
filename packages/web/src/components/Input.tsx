import React, {ChangeEvent, FunctionComponent} from 'react'
import {FieldProps} from 'formik'

type Props = {
  className: string
  name: string
  onBlur: (e: any) => void
  onChange: (e: ChangeEvent<any>) => void
  type: 'email' | 'password' | 'text' // Add more as needed
  value: any
}

export function getFormikClassName(props: FieldProps) {
  if (
    props.form.touched[props.field.name] &&
    props.form.errors[props.field.name]
  ) {
    return 'border-red-300 hover:border-red-500 text-red focus:text-gray-900'
  }
}

export const Input: FunctionComponent<Partial<Props>> = props => (
  <input
    className={`block appearance-none bg-white border border-gray-300 hover:border-gray-500 px-2 py-2 rounded shadow ${props.className ||
      ''}`}
    name={props.name}
    onBlur={props.onBlur}
    onChange={props.onChange}
    type={props.type || 'text'}
    value={props.value}
  />
)
