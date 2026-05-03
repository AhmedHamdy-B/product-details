import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import * as ProductApi from '../api/product'
import { useProductStore } from '../stores/productStore'
import { sampleCatalogueProduct } from './fixtures/sampleCatalogue'

describe('product store', () => {
  beforeEach(() => {
    useProductStore.setState({
      product: null,
      loading: false,
      error: null,
      selectedVariations: {},
      selectedVariant: null,
    })
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('fetchProduct hydrates catalogue data and primes the first variant', async () => {
    vi.spyOn(ProductApi, 'fetchProductBySlug').mockResolvedValue(sampleCatalogueProduct)

    await useProductStore.getState().fetchProduct('look')

    const { product, loading, error, selectedVariations } = useProductStore.getState()
    expect(loading).toBe(false)
    expect(error).toBeNull()
    expect(product?.id).toBe('prod')
    expect(selectedVariations.color).toBe('ash')
    expect(selectedVariations.size).toBe('40')
    expect(useProductStore.getState().selectedVariant?.id).toBe('ash-40')
  })

  it('surfaces network failures via ingestError', async () => {
    vi.spyOn(ProductApi, 'fetchProductBySlug').mockRejectedValue(new Error('502'))

    await useProductStore.getState().fetchProduct('missing')

    const { loading, error, product } = useProductStore.getState()
    expect(loading).toBe(false)
    expect(error).toBe('502')
    expect(product).toBeNull()
  })

  it('getter reflects payable price for the locked variant', async () => {
    vi.spyOn(ProductApi, 'fetchProductBySlug').mockResolvedValue(sampleCatalogueProduct)
    await useProductStore.getState().fetchProduct('look')

    const payable = useProductStore.getState().getCurrentSalePrice()
    expect(payable).toBeGreaterThan(0)
    expect(useProductStore.getState().isVariantAvailable()).toBe(true)
  })

  it('updates selection when variation chips change', async () => {
    vi.spyOn(ProductApi, 'fetchProductBySlug').mockResolvedValue(sampleCatalogueProduct)
    await useProductStore.getState().fetchProduct('look')

    useProductStore.getState().setSelectedVariation('size', '41')
    expect(useProductStore.getState().selectedVariant?.id).toBe('ash-41')
  })
})
