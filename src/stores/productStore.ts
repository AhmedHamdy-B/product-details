import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'

import type { Product, ProductVariant } from '../types/product'
import { resolveCatalogAndPayable } from '../lib/pricing'
import {
  buildGallery as buildGalleryUrls,
  findVariantForSelections,
  variationKey,
} from '../lib/variants'

export type ProductStore = {
  selectedVariations: Record<string, string>

  initializeSelections: (product: Product) => void
  setSelectedVariation: (variationType: string, value: string) => void
  clearSelectedVariations: () => void
}

/** Pure derivation helpers are exported so UI/tests can stay store-agnostic. */
export function selectVariantForProduct(
  product: Product,
  selectedVariations: Record<string, string>,
): ProductVariant | null {
  return findVariantForSelections(product, selectedVariations)
}

export function getProductPrices(product: Product, selectedVariant: ProductVariant | null) {
  return resolveCatalogAndPayable(product, selectedVariant)
}

export function isVariantSelectionComplete(
  product: Product,
  selectedVariations: Record<string, string>,
  selectedVariant: ProductVariant | null,
): boolean {
  const required = product.variations.map((variation) => variationKey(variation.name))
  const allChosen = required.every((key) => Boolean(selectedVariations[key]))
  return allChosen && selectedVariant !== null
}

export function buildProductGallery(product: Product, selectedVariations: Record<string, string>) {
  return buildGalleryUrls(product, selectedVariations)
}

/** Seed defaults from the first variant to match initial PDP visual state. */
function defaultSelectionsForProduct(product: Product): Record<string, string> {
  const seed: Record<string, string> = {}
  const first = product.variants[0]
  if (!first) return seed
  for (const vp of first.variation_props) {
    seed[variationKey(vp.variation)] = vp.variation_prop
  }
  return seed
}

export function getInitialSelectionsForProduct(
  product: Product,
): Record<string, string> {
  return defaultSelectionsForProduct(product)
}

/** Prevent accidental whitespace-only values from polluting selection state. */
function sanitizeSelectionValue(value: string): string {
  return value.trim()
}

export const useProductStore = create<ProductStore>()(
  immer((set) => ({
    selectedVariations: {},

    initializeSelections: (product) => {
      set((draft) => {
        draft.selectedVariations = defaultSelectionsForProduct(product)
      })
    },

    setSelectedVariation: (variationType, value) => {
      set((draft) => {
        // Always normalize keys so casing/localized labels do not fork state shape.
        const normalizedKey = variationKey(variationType)
        const normalizedValue = sanitizeSelectionValue(value)
        if (!normalizedValue) {
          delete draft.selectedVariations[normalizedKey]
          return
        }
        draft.selectedVariations[normalizedKey] = normalizedValue
      })
    },

    clearSelectedVariations: () => {
      set((draft) => {
        draft.selectedVariations = {}
      })
    },
  })),
)
