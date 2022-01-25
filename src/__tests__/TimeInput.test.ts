import { render, screen, fireEvent, prettyDOM } from '@testing-library/svelte'

import TimeInput from '../components/TimeInput.svelte'

describe('test input tests', () => {
  test('should convert valid time input to date', async () => {
    const props = {
      label: 'testing',
      id: 'testing-id',
      value: '',
    }
    const { component } = render(TimeInput, { props })
    const input = screen.queryByDisplayValue('__:__')
    const inputedTime = '08:00'
    const mockEvent = jest.fn()
    component.$on('timeChange', (e) => {
      console.log('happened')
      mockEvent(e.detail)
    })
    await fireEvent.focus(input)
    await fireEvent.select(input, {
      target: {
        selectionStart: 0,
        selectionEnd: 5,
      }
    })
    await fireEvent.paste(input, {
      clipboardData: {
        getData: () => inputedTime
      }
    })
    
    console.log(mockEvent.mock.calls)
    expect(mockEvent).toHaveBeenCalled();
  })
})