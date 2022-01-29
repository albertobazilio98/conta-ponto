import { render, screen, fireEvent } from '@testing-library/svelte'
import ContaPonto from '../components/ContaPonto.svelte'
import { fillInput } from '../tesHelpers'

describe('journey time balance tests', () => {
  test('A incomplete journey should not display time balance', async () => {
    render(ContaPonto)
    const firstEnter = screen.getByTestId('journey-enter-0')
    const firstLeave = screen.getByTestId('journey-leave-0')
    const secondEnter = screen.getByTestId('journey-enter-1')
    await fillInput(firstEnter, '12:00')
    await fillInput(firstLeave, '08:00')
    await fillInput(secondEnter, '13:00')
    const timeBalance = screen.queryByTestId('time-balance')

    expect(timeBalance).not.toBeInTheDocument()
  })

  test('A journey with non sequential times should display error', async () => {
    render(ContaPonto)
    const firstEnter = screen.getByTestId('journey-enter-0')
    const firstLeave = screen.getByTestId('journey-leave-0')
    const secondEnter = screen.getByTestId('journey-enter-1')
    const secondLeave = screen.getByTestId('journey-leave-1')
    await fillInput(firstEnter, '12:00')
    await fillInput(firstLeave, '08:00')
    await fillInput(secondEnter, '13:00')
    await fillInput(secondLeave, '17:00')
    const timeBalance = screen.queryByTestId('time-balance')
    const error = screen.queryByTestId('error-times-are-not-sequential')

    expect(timeBalance).not.toBeInTheDocument()
    expect(error).toBeInTheDocument()
  })

  test('9 hours journey with default (8 hours) base journey should have a balance of positive 1 hour', async () => {
    render(ContaPonto)
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
    expect(timeBalance).toHaveTextContent('+01:00')
  })

  test('7 hours journey with default (8 hours) base journey should have a balance of negative 1 hour', async () => {
    render(ContaPonto)
    const firstEnter = screen.getByTestId('journey-enter-0')
    const firstLeave = screen.getByTestId('journey-leave-0')
    const secondEnter = screen.getByTestId('journey-enter-1')
    const secondLeave = screen.getByTestId('journey-leave-1')
    await fillInput(firstEnter, '08:30')
    await fillInput(firstLeave, '12:00')
    await fillInput(secondEnter, '13:00')
    await fillInput(secondLeave, '16:30')
    const timeBalance = screen.queryByTestId('time-balance')

    expect(timeBalance).toBeInTheDocument()
    expect(timeBalance).toHaveTextContent('-01:00')
  })

  test('8 hours journey with default (8 hours) base journey should have a balance of 0 hours', async () => {
    render(ContaPonto)
    const firstEnter = screen.getByTestId('journey-enter-0')
    const firstLeave = screen.getByTestId('journey-leave-0')
    const secondEnter = screen.getByTestId('journey-enter-1')
    const secondLeave = screen.getByTestId('journey-leave-1')
    await fillInput(firstEnter, '08:00')
    await fillInput(firstLeave, '12:00')
    await fillInput(secondEnter, '13:00')
    await fillInput(secondLeave, '17:00')
    const timeBalance = screen.queryByTestId('time-balance')

    expect(timeBalance).toBeInTheDocument()
    expect(timeBalance).toHaveTextContent('+00:00')
  })

  test('a 8 hours journey with 3 turns and base journey of 10 hours should have a balance of negative 2 hour', async () => {
    render(ContaPonto)
    const addTurnButton = screen.getByTestId('add-turn')
    await fireEvent.click(addTurnButton)

    const baseJourney = screen.getByTestId('base-journey-input')
    const firstEnter = screen.getByTestId('journey-enter-0')
    const firstLeave = screen.getByTestId('journey-leave-0')
    const secondEnter = screen.getByTestId('journey-enter-1')
    const secondLeave = screen.getByTestId('journey-leave-1')
    const thirdEnter = screen.getByTestId('journey-enter-2')
    const thirdLeave = screen.getByTestId('journey-leave-2')
    await fillInput(baseJourney, '10:00')
    await fillInput(firstEnter, '07:30')
    await fillInput(firstLeave, '09:00')
    await fillInput(secondEnter, '11:30')
    await fillInput(secondLeave, '14:30')
    await fillInput(thirdEnter, '15:30')
    await fillInput(thirdLeave, '19:00')
    const timeBalance = screen.queryByTestId('time-balance')

    expect(timeBalance).toBeInTheDocument()
    expect(timeBalance).toHaveTextContent('-02:00')
  })

  test('a 7 hours journey with 1 turns and base journey of 6 hours should have a balance of positive hour', async () => {
    render(ContaPonto)
    const addTurnButton = screen.getByTestId('remove-turn')
    await fireEvent.click(addTurnButton)

    const baseJourney = screen.getByTestId('base-journey-input')
    const firstEnter = screen.getByTestId('journey-enter-0')
    const firstLeave = screen.getByTestId('journey-leave-0')
    await fillInput(baseJourney, '06:00')
    await fillInput(firstEnter, '12:30')
    await fillInput(firstLeave, '19:30')
    const timeBalance = screen.queryByTestId('time-balance')

    expect(timeBalance).toBeInTheDocument()
    expect(timeBalance).toHaveTextContent('+01:00')
  })
})