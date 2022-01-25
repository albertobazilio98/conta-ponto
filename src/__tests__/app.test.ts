import { render, screen } from '@testing-library/svelte'

import App from '../App.svelte'

test('should render app', () => {
  render(App)

  expect(screen.getByText('Conta ponto')).toBeInTheDocument()
})