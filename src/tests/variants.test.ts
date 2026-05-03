import { describe, expect, it } from 'vitest'

import type { Product, ProductVariant, Variation } from '../types/product'

import {
  buildGallery,
  findVariantForSelections,
  isOptionSelectable,
  variationKey,
} from '../lib/variants'

const colorVariation: Variation = {
  id: 'c1',
  name: 'color',
  product_id: 'prod',
  type: 'image',
  props: [
    {
      id: 'cp1',
      name: 'ash',
      variation_id: 'c1',
      value: 'https://example.test/ash.png',
    },
    {
      id: 'cp2',
      name: 'ink',
      variation_id: 'c1',
      value: 'https://example.test/ink.png',
    },
  ],
}

const sizeVariation: Variation = {
  id: 's1',
  name: 'size',
  product_id: 'prod',
  type: 'button',
  props: [
    {
      id: 'sp40',
      name: '40',
      variation_id: 's1',
    },
    {
      id: 'sp41',
      name: '41',
      variation_id: 's1',
    },
  ],
}

function createVariant(colors: string, sizes: string): ProductVariant {
  return {
    id: `${colors}-${sizes}`,
    product_id: 'prod',
    price: 120,
    sale_price: 0,
    quantity: 5,
    variation_props: [
      {
        id: `${colors}-${sizes}-c`,
        variation: 'color',
        variation_prop: colors,
        product_variant_id: `${colors}-${sizes}`,
      },
      {
        id: `${colors}-${sizes}-s`,
        variation: 'size',
        variation_prop: sizes,
        product_variant_id: `${colors}-${sizes}`,
      },
    ],
  }
}

const sampleProduct: Product = {
  id: 'prod',
  slug: 'look',
  name: 'Hybrid Trainer',
  price: 220,
  sale_price: 0,
  description: '',
  thumb: 'https://example.test/thumb.webp',
  images: [],
  variations: [colorVariation, sizeVariation],
  variants: [
    createVariant('ash', '40'),
    createVariant('ash', '41'),
    createVariant('ink', '41'),
  ],
  quantity: 0,
  track_stock: false,
  categories: [],
}

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
    expect(gallery.at(0)).toBe(colorVariation.props[1].value)
  })
})
