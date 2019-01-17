import {RouteComponentProps} from '@reach/router'

export const Routable = (
  props: {component: JSX.Element} & RouteComponentProps,
) => props.component
