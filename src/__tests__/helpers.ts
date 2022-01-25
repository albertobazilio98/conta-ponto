import { fireEvent } from '@testing-library/svelte'

export const fillInput = async (input: Document | Element | Window, value: string) => {
  await fireEvent.focus(input)
  await fireEvent.select(input, {
    target: {
      selectionStart: 0,
      selectionEnd: 5,
    }
  })
  await fireEvent.paste(input, {
    clipboardData: {
      getData: () => value
    }
  })

}