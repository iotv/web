import React, {FunctionComponent} from 'react'

export type Props = {
  htmlFor: string
}

export const FormLabel: FunctionComponent<Partial<Props>> = props => (
  <label className={'font-bold text-grey-700 block mb-2'}>
    {props.children}
  </label>
)
