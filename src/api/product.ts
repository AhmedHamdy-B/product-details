import type { Product } from '../types/product'
import { appConfig } from '../config/appConfig'

/** Backwards-compatible default slug used when route param is missing. */
export const TASK_PRODUCT_SLUG = appConfig.defaultProductSlug

const EASY_ORDERS_API_BASE = appConfig.apiBaseUrl
const TASK_STORE_KEY = appConfig.storeKey

export function productUrlForSlug(slug: string, joinReviews = true): string {
  const qs = joinReviews ? '?join=reviews' : ''
  return `${EASY_ORDERS_API_BASE}/${TASK_STORE_KEY}/${encodeURIComponent(slug)}${qs}`
}

/** Backwards-compatible full URL for the task product. */
export const PRODUCT_ENDPOINT = productUrlForSlug(TASK_PRODUCT_SLUG)

export async function fetchProductBySlug(slug: string, signal?: AbortSignal): Promise<Product> {
  return fetchProductByUrl(productUrlForSlug(slug), signal)
}

export async function fetchProductByUrl(
  url: string = PRODUCT_ENDPOINT,
  signal?: AbortSignal,
): Promise<Product> {
  const response = await fetch(url, { signal })
  if (!response.ok) {
    throw new Error(`Unable to load product (${response.status})`)
  }
  return (await response.json()) as Product
}
