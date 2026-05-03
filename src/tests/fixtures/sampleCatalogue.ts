import type { Product, ProductVariant, Variation } from '../../types/product'

export const fixtureColorVariation: Variation = {
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

export const fixtureSizeVariation: Variation = {
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

export function fixtureVariant(colors: string, sizes: string): ProductVariant {
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

export const sampleCatalogueProduct: Product = {
  id: 'prod',
  slug: 'look',
  name: 'Hybrid Trainer',
  price: 220,
  sale_price: 0,
  description: '',
  thumb: 'https://example.test/thumb.webp',
  images: [],
  variations: [fixtureColorVariation, fixtureSizeVariation],
  variants: [
    fixtureVariant('ash', '40'),
    fixtureVariant('ash', '41'),
    fixtureVariant('ink', '41'),
  ],
  quantity: 0,
  track_stock: false,
  categories: [],
}
