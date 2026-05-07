import { beforeEach, describe, expect, it } from 'vitest'

import { useCartStore } from '../stores/cartStore'
import { selectCartTotal } from '../stores/selectors'

describe('cart store', () => {
  beforeEach(() => {
    localStorage.clear()
    useCartStore.setState({
      lines: [],
      drawerOpen: false,
      toast: null,
    })
  })

  it('combines quantities for identical sku lines', () => {
    useCartStore.getState().addItem({
      productId: 'p1',
      slug: 'shoe',
      name: 'Trainer',
      image: '/a.jpg',
      variantId: 'v1',
      selections: { color: 'ash' },
      unitPrice: 50,
      quantity: 1,
    })
    useCartStore.getState().addItem({
      productId: 'p1',
      slug: 'shoe',
      name: 'Trainer',
      image: '/a.jpg',
      variantId: 'v1',
      selections: { color: 'ash' },
      unitPrice: 50,
      quantity: 2,
    })

    const { lines } = useCartStore.getState()
    expect(lines).toHaveLength(1)
    expect(lines[0].quantity).toBe(3)
  })

  it('calculates cart total across lines', () => {
    useCartStore.getState().addItem({
      productId: 'p1',
      slug: 'a',
      name: 'A',
      image: '/a.jpg',
      unitPrice: 10,
      selections: {},
      quantity: 2,
    })
    useCartStore.getState().addItem({
      productId: 'p2',
      slug: 'b',
      name: 'B',
      image: '/b.jpg',
      unitPrice: 5,
      selections: {},
      quantity: 1,
    })

    expect(selectCartTotal(useCartStore.getState())).toBe(25)
  })

  it('merges equivalent lines even when selection key order differs', () => {
    useCartStore.getState().addItem({
      productId: 'p1',
      slug: 'shoe',
      name: 'Trainer',
      image: '/a.jpg',
      variantId: 'v1',
      selections: { color: 'ash', size: '40' },
      unitPrice: 50,
      quantity: 1,
    })
    useCartStore.getState().addItem({
      productId: 'p1',
      slug: 'shoe',
      name: 'Trainer',
      image: '/a.jpg',
      variantId: 'v1',
      selections: { size: '40', color: 'ash' },
      unitPrice: 50,
      quantity: 2,
    })

    const { lines } = useCartStore.getState()
    expect(lines).toHaveLength(1)
    expect(lines[0].quantity).toBe(3)
  })

  it('removes a line when quantity drops to zero', () => {
    useCartStore.getState().addItem({
      productId: 'p1',
      slug: 'a',
      name: 'A',
      image: '/a.jpg',
      unitPrice: 10,
      selections: {},
      quantity: 1,
    })

    const id = useCartStore.getState().lines[0].id
    useCartStore.getState().setQuantity(id, 0)

    expect(useCartStore.getState().lines).toHaveLength(0)
  })
})
