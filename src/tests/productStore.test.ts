import { beforeEach, describe, expect, it } from 'vitest'

import {
  getProductPrices,
  isVariantSelectionComplete,
  selectVariantForProduct,
  useProductStore,
} from '../stores/productStore'
import { sampleCatalogueProduct } from './fixtures/sampleCatalogue'

describe('product store', () => {
  beforeEach(() => {
    useProductStore.setState({
      selectedVariations: {},
    })
  })

  it('initializes first variant selections from product payload', () => {
    useProductStore.getState().initializeSelections(sampleCatalogueProduct)
    const { selectedVariations } = useProductStore.getState()
    expect(selectedVariations.color).toBe('ash')
    expect(selectedVariations.size).toBe('40')
    const selected = selectVariantForProduct(sampleCatalogueProduct, selectedVariations)
    expect(selected?.id).toBe('ash-40')
  })

  it('derives payable price and availability from selected variant', () => {
    useProductStore.getState().initializeSelections(sampleCatalogueProduct)
    const selections = useProductStore.getState().selectedVariations
    const selectedVariant = selectVariantForProduct(sampleCatalogueProduct, selections)
    const pricing = getProductPrices(sampleCatalogueProduct, selectedVariant)

    expect(pricing.payable).toBeGreaterThan(0)
    expect(isVariantSelectionComplete(sampleCatalogueProduct, selections, selectedVariant)).toBe(
      true,
    )
  })

  it('updates selection when variation chips change', () => {
    useProductStore.getState().initializeSelections(sampleCatalogueProduct)
    useProductStore.getState().setSelectedVariation('size', '41')
    const selections = useProductStore.getState().selectedVariations
    const selected = selectVariantForProduct(sampleCatalogueProduct, selections)
    expect(selected?.id).toBe('ash-41')
  })
})
