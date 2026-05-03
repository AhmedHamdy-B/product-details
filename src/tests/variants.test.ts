import { describe, expect, it } from 'vitest'

import {
  buildGallery,
  findVariantForSelections,
  isOptionSelectable,
  variationKey,
} from '../lib/variants'

import {
  fixtureColorVariation,
  sampleCatalogueProduct as sampleProduct,
} from './fixtures/sampleCatalogue'

describe('variant utilities', () => {
  it('normalises variation names', () => {
    expect(variationKey('Color')).toBe('color')
  })

  it('returns null until every grouping is accounted for', () => {
    const partial = findVariantForSelections(sampleProduct, { color: 'ash' })
    expect(partial).toBeNull()
  })

  it('pins the correct variant SKU when pairing is exhaustive', () => {
    const match = findVariantForSelections(sampleProduct, {
      color: 'ash',
      size: '40',
    })

    expect(match?.id).toBe('ash-40')
  })

  it('prevents unattainable permutations across matrix cells', () => {
    expect(
      isOptionSelectable(sampleProduct, 'color', 'ink', {
        color: '',
        size: '40',
      }),
    ).toBe(false)
  })

  it('surfaces the colour hero frame first for gallery choreography', () => {
    const gallery = buildGallery(sampleProduct, { color: 'ink', size: '41' })
    expect(gallery.at(0)).toBe(fixtureColorVariation.props[1].value)
  })
})
