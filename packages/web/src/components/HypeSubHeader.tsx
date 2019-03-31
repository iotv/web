import React, {FunctionComponent} from 'react'

type Props = {
  className: string
}

export const HypeSubHeader: FunctionComponent<Partial<Props>> = props => (
  <h1
    className={`font-sans font-thin text-lg text-gray-500 ${props.className ||
      ''}`}
  >
    {props.children}
  </h1>
)
