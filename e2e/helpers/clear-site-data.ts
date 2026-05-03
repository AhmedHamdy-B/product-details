import type { Page } from '@playwright/test'

/** Deterministic E2E: cart + wishlist use `localStorage` via Zustand `persist`. */
export async function clearClientStorage(page: Page): Promise<void> {
  await page.addInitScript(() => {
    try {
      localStorage.clear()
    } catch {
      /* ignore */
    }
  })
}
