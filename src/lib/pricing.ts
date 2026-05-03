import type { Product, ProductVariant } from '../types/product'

export function resolveCatalogAndPayable(
  product: Product | null,
  variant: ProductVariant | null,
): { catalog: number; payable: number } {
  if (!product) return { catalog: 0, payable: 0 }
  const catalog = variant?.price ?? product.price
  let payable = catalog

  if (variant && variant.sale_price > 0 && variant.sale_price < variant.price) {
    payable = variant.sale_price
  } else if (product.sale_price > 0 && product.sale_price < catalog) {
    payable = product.sale_price
  }

  return { catalog, payable }
}

export function savingsAmount(catalog: number, payable: number): number {
  return Math.max(0, catalog - payable)
}
