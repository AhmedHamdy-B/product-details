import type { Product } from '../types/product'

export const PRODUCT_ENDPOINT =
  'https://api.easy-orders.net/api/v1/products/slug/clear-theme/Sneakers12?join=reviews'

export async function fetchProductByUrl(url: string = PRODUCT_ENDPOINT): Promise<Product> {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`Unable to load product (${response.status})`)
  }
  return (await response.json()) as Product
}
