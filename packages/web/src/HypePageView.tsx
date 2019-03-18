import React, {FunctionComponent} from 'react'

import {HypeMainHeader} from './components/HypeMainHeader'
import {HypeSubHeader} from './components/HypeSubHeader'

export const HypePageView: FunctionComponent = props => (
  <div className={'bg-black flex flex-row justify-around'}>
    <div className={'flex flex-col flex-grow items-center max-w-md'}>
      <HypeMainHeader className={'text-center'}>
        A Collaborative Video Community
      </HypeMainHeader>
      <HypeSubHeader className={'text-center'}>
        Stream, edit, remix, and collaborate all in one open, social, video
        platform. iotv provides creators and viewers with the tools to develop,
        interact with, and enjoy video content.
      </HypeSubHeader>
    </div>
  </div>
)
