import React from 'react'
import {render, fireEvent} from 'react-testing-library'
import {Button} from './Button'

test('clicking fires onClick when defined', () => {
  // Given
  const mockOnClick = jest.fn()
  const {getByText} = render(
    <Button data-testid={'button'} onClick={mockOnClick}>
      Test Button
    </Button>,
  )

  // When
  fireEvent.click(getByText('Test Button'))

  // Then
  expect(mockOnClick).toBeCalled()
})
