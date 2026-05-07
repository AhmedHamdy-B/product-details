type AppConfig = {
  apiBaseUrl: string
  storeKey: string
  defaultProductSlug: string
}

function readStringEnv(value: unknown, fallback: string): string {
  return typeof value === 'string' && value.trim() ? value.trim() : fallback
}

function readRuntimeEnv(): Record<string, unknown> {
  // `import.meta.env` exists in Vite browser builds, but some Node-based tooling
  // (e.g. Playwright config/test bootstrap) can load this module without it.
  const env = (import.meta as ImportMeta & { env?: Record<string, unknown> }).env
  return env ?? {}
}

const runtimeEnv = readRuntimeEnv()

export const appConfig: AppConfig = {
  apiBaseUrl: readStringEnv(
    runtimeEnv.VITE_API_BASE_URL,
    'https://api.easy-orders.net/api/v1/products/slug',
  ),
  storeKey: readStringEnv(runtimeEnv.VITE_STORE_KEY, 'clear-theme'),
  defaultProductSlug: readStringEnv(runtimeEnv.VITE_DEFAULT_PRODUCT_SLUG, 'Sneakers12'),
}
