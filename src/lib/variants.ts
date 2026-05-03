import type { Product, ProductVariant } from '../types/product'

export function variationKey(name: string) {
  return name.toLowerCase()
}

export function variantToMap(variant: ProductVariant): Record<string, string> {
  return Object.fromEntries(
    variant.variation_props.map((p) => [variationKey(p.variation), p.variation_prop]),
  )
}

export function findVariantForSelections(
  product: Product,
  selections: Record<string, string>,
): ProductVariant | null {
  const required = product.variations.map((v) => variationKey(v.name))
  const complete = required.every((key) => Boolean(selections[key]))
  if (!complete) return null

  const match =
    product.variants.find((v) => {
      const map = variantToMap(v)
      return required.every((key) => map[key] === selections[key])
    }) ?? null
  return match
}

/** True if candidate value keeps at least one matching variant alongside current selections. */
export function isOptionSelectable(
  product: Product,
  variationKeyName: string,
  optionValue: string,
  currentSelections: Record<string, string>,
): boolean {
  const key = variationKey(variationKeyName)
  const candidate = { ...currentSelections, [key]: optionValue }
  return product.variants.some((v) => {
    const map = variantToMap(v)
    return Object.entries(candidate).every(([k, val]) => map[k] === val)
  })
}

export function buildGallery(product: Product, selections: Record<string, string>): string[] {
  const colorKey = variationKey('color')
  const urls = [...new Set([product.thumb, ...product.images].filter(Boolean))]
  const colorVar = product.variations.find((v) => variationKey(v.name) === colorKey)

  const selectedColor = selections[colorKey]
  const prop = selectedColor
    ? colorVar?.props?.find((candidate) => String(candidate.name) === String(selectedColor))
    : undefined
  const colorImage = prop?.value

  if (colorImage) {
    const rest = urls.filter((u) => u !== colorImage)
    return [colorImage, ...rest]
  }
  return urls
}
