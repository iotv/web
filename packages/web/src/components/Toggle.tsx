import React, {FunctionComponent, useState, SyntheticEvent} from 'react'
import {
  Check,
  X,
  TrendingUp,
  TrendingDown,
  Sun,
  Moon,
  Icon,
} from 'react-feather'
import {css} from '@emotion/core'

export type ToggleProps = {
  CheckedIcon: Icon
  UncheckedIcon: Icon
}

export const Toggle: FunctionComponent<ToggleProps> = props => {
  const [isChecked, setIsChecked] = useState(false)

  function onClick(event: SyntheticEvent) {
    event.preventDefault()
    setIsChecked(!isChecked)
  }

  return (
    <div
      onClick={onClick}
      css={css`
        touch-action: pan-x;
        -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
        -webkit-tap-highlight-color: transparent;
      `}
      className={
        'bg-transparent cursor-pointer inline-block relative select-none'
      }
    >
      {/* Toggle Track */}
      <div
        css={css`
          -webkit-box-sizing: border-box;
          -moz-box-sizing: border-box;
          box-sizing: border-box;
          -webkit-transition: all 0.2s ease;
          -moz-transition: all 0.2s ease;
          transition: all 0.2s ease;
        `}
        className={`rounded-full p-0 w-12 h-6 border-solid border-2 ${
          isChecked
            ? 'bg-green-500 border-green-700'
            : 'bg-gray-500 border-gray-700'
        }`}
      >
        {/* Toggle Track Check */}
        <div
          css={css`
            line-height: 0;
            margin-top: auto;
            margin-bottom: auto;
            left: 0.35rem;
            transition: all 0.2s ease;
          `}
          className={`absolute w-3 h-4 top-0 bottom-0 ${
            isChecked ? 'visible' : 'invisible'
          }`}
        >
          <props.CheckedIcon color="white" size="1rem" />
        </div>
        {/* Toggle Track X */}
        <div
          css={css`
            line-height: 0;
            margin-top: auto;
            margin-bottom: auto;
            right: 0.85rem;
            transition: all 0.2s ease;
          `}
          className={`absolute w-2 h-4 top-0 bottom-0 ${
            isChecked ? 'invisible' : 'visible'
          }`}
        >
          <props.UncheckedIcon color="#22292F" size="1rem" />
        </div>
      </div>
      {/* Toggle Thumb Knob */}
      <div
        css={css`
          -webkit-box-sizing: border-box;
          -moz-box-sizing: border-box;
          box-sizing: border-box;
          ${isChecked ? 'left: 1.5rem;' : 'left: 0;'}
          transition: all 0.25s ease;
        `}
        className={`border-solid border-2 ${
          isChecked ? 'border-green-700' : 'border-gray-700'
        } rounded-full absolute w-6 h-6 bg-gray-100 top-0`}
      />
      <input
        type="checkbox"
        checked={isChecked}
        css={css`
          clip-path: inset(0 0);
        `}
        className={'border-0 h-px w-px overflow-hidden p-0 -m-1 absolute'}
      />
    </div>
  )
}
