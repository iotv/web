import React, {FunctionComponent} from 'react'
import {css} from '@emotion/core'
export type ButtonProps = {
  disabled: boolean
  type: string
  text: string
}
const Button: FunctionComponent<Partial<ButtonProps>> = props => (
  <button
    className={
      'flex bg-blue-dark hover:bg-blue text-white font-bold py-2 px-4 rounded'
    }
    disabled={props.disabled}
    type={props.type ? props.type : 'submit'}
  >
    {props.text}
  </button>
)

export default Button
