import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'

import { CartDrawer } from '../components/CartDrawer'
import { useCartStore } from '../stores/cartStore'

describe('CartDrawer', () => {
  beforeEach(() => {
    localStorage.clear()
    useCartStore.setState({ lines: [], drawerOpen: false, toast: null })
  })

  it('shows the empty-state copy while the drawer is open', () => {
    useCartStore.setState({ drawerOpen: true })

    render(
      <CartDrawer />,
    )

    expect(screen.getByText(/resting for now/i)).toBeInTheDocument()
    expect(screen.getByRole('dialog', { name: /your basket/i })).toBeInTheDocument()
  })
})
