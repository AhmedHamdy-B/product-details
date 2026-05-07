type AppConfig = {
  apiBaseUrl: string
  storeKey: string
  defaultProductSlug: string
}

function readStringEnv(value: unknown, fallback: string): string {
  return typeof value === 'string' && value.trim() ? value.trim() : fallback
}

export const appConfig: AppConfig = {
  apiBaseUrl: readStringEnv(
    import.meta.env.VITE_API_BASE_URL,
    'https://api.easy-orders.net/api/v1/products/slug',
  ),
  storeKey: readStringEnv(import.meta.env.VITE_STORE_KEY, 'clear-theme'),
  defaultProductSlug: readStringEnv(import.meta.env.VITE_DEFAULT_PRODUCT_SLUG, 'Sneakers12'),
}
