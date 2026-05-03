import { describe, expect, it } from 'vitest'

import { savingsAmount } from '../lib/pricing'

describe('savings helpers', () => {
  it('captures GBP delta between catalogue and payable lines', () => {
    expect(savingsAmount(190, 160)).toBe(30)
    expect(savingsAmount(125, 125)).toBe(0)
  })
})
