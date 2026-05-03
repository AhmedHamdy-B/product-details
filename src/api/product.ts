import type { Product } from '../types/product'

/** Task reference slug from the ElegantSoft readme (EasyOrders “clear-theme” store). */
export const TASK_PRODUCT_SLUG = 'Sneakers12'

const EASY_ORDERS_API_BASE = 'https://api.easy-orders.net/api/v1/products/slug'
const TASK_STORE_KEY = 'clear-theme'

export function productUrlForSlug(slug: string, joinReviews = true): string {
  const qs = joinReviews ? '?join=reviews' : ''
  return `${EASY_ORDERS_API_BASE}/${TASK_STORE_KEY}/${encodeURIComponent(slug)}${qs}`
}

/** Backwards-compatible full URL for the task product. */
export const PRODUCT_ENDPOINT = productUrlForSlug(TASK_PRODUCT_SLUG)

export async function fetchProductBySlug(slug: string): Promise<Product> {
  return fetchProductByUrl(productUrlForSlug(slug))
}

export async function fetchProductByUrl(url: string = PRODUCT_ENDPOINT): Promise<Product> {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`Unable to load product (${response.status})`)
  }
  return (await response.json()) as Product
}
