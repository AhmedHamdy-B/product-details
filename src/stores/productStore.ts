import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'

import type { Product, ProductVariant } from '../types/product'
import { PRODUCT_ENDPOINT, fetchProductByUrl } from '../api/product'
import { resolveCatalogAndPayable } from '../lib/pricing'
import {
  buildGallery as buildGalleryUrls,
  findVariantForSelections,
  variationKey,
} from '../lib/variants'

export type ProductStore = {
  product: Product | null
  loading: boolean
  error: string | null
  selectedVariations: Record<string, string>
  selectedVariant: ProductVariant | null

  fetchProduct: (endpoint?: string) => Promise<void>
  setSelectedVariation: (variationType: string, value: string) => void
  clearSelectedVariations: () => void
  hydrateSelectionFromVariant: (variant: ProductVariant) => void

  /** Catalogue (“was”) price shown struck-through when discounted */
  getCurrentPrice: () => number
  /** Payable selling price shown bold; combine with catalogue to detect discount UI */
  getCurrentSalePrice: () => number
  isVariantAvailable: () => boolean
  getGallery: () => string[]
}

function applySelection(
  draft: Pick<ProductStore, 'product' | 'selectedVariations' | 'selectedVariant'>,
) {
  const product = draft.product
  if (!product) {
    draft.selectedVariant = null
    return
  }
  draft.selectedVariant = findVariantForSelections(product, draft.selectedVariations)
}

export const useProductStore = create<ProductStore>()(
  immer((set, get) => ({
    product: null,
    loading: false,
    error: null,
    selectedVariations: {},
    selectedVariant: null,

    fetchProduct: async (endpoint = PRODUCT_ENDPOINT) => {
      set((draft) => {
        draft.loading = true
        draft.error = null
      })
      try {
        const data = await fetchProductByUrl(endpoint)
        set((draft) => {
          draft.product = data
          draft.loading = false
          draft.selectedVariations = {}
          const first = data.variants[0]
          if (first) {
            for (const vp of first.variation_props) {
              draft.selectedVariations[variationKey(vp.variation)] = vp.variation_prop
            }
          }
          applySelection(draft)
        })
      } catch (e) {
        const message =
          e instanceof Error ? e.message : 'Something went wrong while loading product'
        set((draft) => {
          draft.loading = false
          draft.error = message
          draft.product = null
          draft.selectedVariations = {}
          draft.selectedVariant = null
        })
      }
    },

    setSelectedVariation: (variationType, value) => {
      set((draft) => {
        draft.selectedVariations[variationKey(variationType)] = value
        applySelection(draft)
      })
    },

    clearSelectedVariations: () => {
      set((draft) => {
        draft.selectedVariations = {}
        draft.selectedVariant = null
      })
    },

    hydrateSelectionFromVariant: (variant) => {
      set((draft) => {
        draft.selectedVariations = {}
        for (const vp of variant.variation_props) {
          draft.selectedVariations[variationKey(vp.variation)] = vp.variation_prop
        }
        applySelection(draft)
      })
    },

    getCurrentPrice: () => {
      const { product, selectedVariant } = get()
      return resolveCatalogAndPayable(product, selectedVariant).catalog
    },

    getCurrentSalePrice: () => {
      const { product, selectedVariant } = get()
      return resolveCatalogAndPayable(product, selectedVariant).payable
    },

    isVariantAvailable: () => {
      const { product, selectedVariant } = get()
      if (!product) return false
      const required = product.variations.map((v) => variationKey(v.name))
      const selections = get().selectedVariations
      const picks = required.every((key) => Boolean(selections[key]))
      return picks && selectedVariant !== null
    },

    getGallery: () => {
      const { product } = get()
      if (!product) return []
      return buildGalleryUrls(product, get().selectedVariations)
    },
  })),
)
