import React, {ChangeEvent, FunctionComponent} from 'react'

type Props = {
  className: string
  name: string
  onBlur: (e: any) => void
  onChange: (e: ChangeEvent<any>) => void
  type: 'email' | 'password' | 'text' // Add more as needed
  value: any
}

export const Input: FunctionComponent<Partial<Props>> = props => (
  <input
    className={`block appearance-none bg-white border border-grey-light hover:border-grey px-2 py-2 rounded shadow ${props.className ||
      ''}`}
    name={props.name}
    onBlur={props.onBlur}
    onChange={props.onChange}
    type={props.type || 'text'}
    value={props.value}
  />
)
