import type { Product } from '../types/product'

/** Basket quantity ceiling respects stock rules from the originating payload when present */
export function getMaxBasketQuantity(product: Product | null, unitStock?: number): number {
  const fallback = 10
  if (!product?.track_stock) return fallback

  const available = typeof unitStock === 'number' ? unitStock : product.quantity ?? 0
  if (available <= 0) return 1 // UI still exposes selector; add-to-cart can surface messaging
  return Math.min(Math.max(available, 1), 10)
}
