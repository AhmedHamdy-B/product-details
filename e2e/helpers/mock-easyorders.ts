import { readFileSync } from 'node:fs'
import { join } from 'node:path'

import type { Page } from '@playwright/test'

const payloadPath = join(process.cwd(), 'e2e/fixtures/sneakers12.json')

/**
 * Offline-stable EasyOrders PDP: intercepts GET /products/slug/... responses.
 */
export async function mockEasyOrdersProductPayload(page: Page): Promise<void> {
  const body = readFileSync(payloadPath, 'utf-8')
  await page.route('**/api/v1/products/slug/**', async (route) => {
    if (route.request().method() !== 'GET') {
      await route.continue()
      return
    }
    await route.fulfill({
      status: 200,
      contentType: 'application/json; charset=utf-8',
      body,
    })
  })
}
