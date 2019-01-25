import React, {FunctionComponent, ReactNode} from 'react'
export type ButtonProps = {
  disabled: boolean
  type: string
  children: ReactNode
}

export const Button: FunctionComponent<Partial<ButtonProps>> = props => (
  <button
    className={
      'flex bg-blue-dark hover:bg-blue text-white font-bold py-2 px-4 rounded'
    }
    disabled={props.disabled}
    type={props.type ? props.type : 'submit'}
  >
    {props.children}
  </button>
)
