import { render, screen, fireEvent } from '@testing-library/svelte'

import ContaPonto from '../components/ContaPonto.svelte'

describe('journey time balance tests', () => {
  test('positive journey time balance', async () => {
    const { component } = render(ContaPonto)
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
})