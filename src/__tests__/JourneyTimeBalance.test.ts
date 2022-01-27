import { render, screen, fireEvent } from '@testing-library/svelte'

import ContaPonto from '../components/ContaPonto.svelte'
import { fillInput } from '../tesHelpers'

describe('journey time balance tests', () => {
  test('positive journey time balance with default base journey', async () => {
    const { component } = render(ContaPonto)
    const firstEnter = screen.getByTestId('journey-enter-0')
    const firstLeave = screen.getByTestId('journey-leave-0')
    const secondEnter = screen.getByTestId('journey-enter-1')
    const secondLeave = screen.getByTestId('journey-leave-1')
    await fillInput(firstEnter, '08:00')
    await fillInput(firstLeave, '12:00')
    await fillInput(secondEnter, '13:00')
    await fillInput(secondLeave, '18:00')
    const timeBalance = screen.queryByTestId('time-balance')
    expect(timeBalance).toBeInTheDocument()
    expect(firstEnter).toBeInTheDocument()
    expect(firstLeave).toBeInTheDocument()
    expect(secondEnter).toBeInTheDocument()
    expect(secondLeave).toBeInTheDocument()
  })
})