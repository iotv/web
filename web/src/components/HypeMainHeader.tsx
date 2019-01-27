import React, {FunctionComponent} from 'react'

type Props = {
  className: string
}

export const HypeMainHeader: FunctionComponent<Partial<Props>> = props => (
  <h1
    className={`font-sans font-thin text-5xl text-grey-light ${
      props.className ? props.className : ''
    }`}
  >
    {props.children}
  </h1>
)
