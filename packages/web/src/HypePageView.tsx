import React, {FunctionComponent} from 'react'
import {css} from '@emotion/core'
import {Check, X} from 'react-feather'

import {HypeMainHeader} from './components/HypeMainHeader'
import {HypeSubHeader} from './components/HypeSubHeader'
import {Toggle} from './components/Toggle'

export const HypePageView: FunctionComponent = props => (
  <>
    <div className={'bg-gray-900 flex flex-row justify-around'}>
      <div className={'flex flex-col flex-grow items-center max-w-md'}>
        <HypeMainHeader className={'text-center'}>
          A Collaborative Video Community
        </HypeMainHeader>
        <HypeSubHeader className={'text-center'}>
          Stream, edit, remix, and collaborate all in one open, social, video
          platform. iotv provides creators and viewers with the tools to
          develop, interact with, and enjoy video content.
        </HypeSubHeader>
      </div>
    </div>
    <div
      css={css`
        margin: 50px;
      `}
    >
      <Toggle
        checkedIconColor="#F0FFF4"
        CheckedIcon={Check}
        checkedKnobClassNames="border-green-700"
        checkedTrackClassNames="bg-green-500 border-green-700"
        knobClassNames="bg-gray-100"
        uncheckedIconColor="#1A202C"
        UncheckedIcon={X}
        uncheckedKnobClassNames="border-gray-700"
        uncheckedTrackClassNames="bg-gray-500 border-gray-700"
      />
    </div>
  </>
)
