import React, {FunctionComponent} from 'react'

type Props = {
  className: string
}

export const HypeMainHeader: FunctionComponent<Partial<Props>> = props => (
  <h1
    className={`font-sans font-light m-1 text-5xl text-gray-200 ${props.className ||
      ''}`}
  >
    {props.children}
  </h1>
)
