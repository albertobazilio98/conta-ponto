import { render, screen, fireEvent } from '@testing-library/svelte'
import { parse, isValid, getUnixTime } from 'date-fns'

import TimeInput from '../components/TimeInput.svelte'

describe('time input timeChange triggering', () => {
  test('should return valid date on valid input', async () => {
    const props = {
      label: 'testing',
      id: 'testing-id',
      value: '',
    }
    const { component } = render(TimeInput, { props })
    const input = screen.queryByDisplayValue('__:__')
    const inputedTime = '08:00'
    const mockEvent = jest.fn()
    let data;
    component.$on('timeChange', (e) => {
      mockEvent(e.detail);
      data = e.detail;
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

    expect(mockEvent).toBeCalled();
    expect(data.date).toEqual(new Date(2022, 0, 6, 8, 0));
    expect(data.value).toEqual(inputedTime);
    expect(data.seconds).toEqual(8 * 60 * 60);
  })

  test('should not return date on invalid input', async () => {
    const props = {
      label: 'testing',
      id: 'testing-id',
      value: '',
    }
    const { component } = render(TimeInput, { props })
    const input = screen.queryByDisplayValue('__:__')
    const inputedTime = '25:00'
    const mockEvent = jest.fn()
    let data;
    component.$on('timeChange', (e) => {
      mockEvent(e.detail);
      data = e.detail;
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

    expect(mockEvent).toBeCalled();
    expect(data.date).toBeFalsy();
    expect(data.value).toEqual(inputedTime);
    expect(data.seconds).toBeFalsy();
  })
})