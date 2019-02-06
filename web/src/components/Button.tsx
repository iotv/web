import React, {FunctionComponent, ReactNode, SyntheticEvent} from 'react'
export type ButtonProps = {
  children: ReactNode
  disabled: boolean
  onClick: () => void
  type: string
}

export const Button: FunctionComponent<Partial<ButtonProps>> = props => {
  function onClickHandler(event: SyntheticEvent) {
    if (props.onClick) {
      event.preventDefault()
      props.onClick()
    }
  }

  return (
    <button
      className={
        'flex bg-blue-dark hover:bg-blue text-white font-bold py-2 px-4 rounded'
      }
      disabled={props.disabled}
      onClick={onClickHandler}
      type={props.type || 'submit'}
    >
      {props.children}
    </button>
  )
}
