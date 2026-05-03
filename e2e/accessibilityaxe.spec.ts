import AxeBuilder from '@axe-core/playwright'
import { test, expect } from '@playwright/test'

import { clearClientStorage } from './helpers/clear-site-data'
import { mockEasyOrdersProductPayload } from './helpers/mock-easyorders'

/** Focus `<main>` (product chrome) — third-party rails still ship demo buttons but we scan the primary PDP chrome first. */
test.describe('Axe · PDP main landmark', () => {
  test.beforeEach(async ({ page }) => {
    await clearClientStorage(page)
    await mockEasyOrdersProductPayload(page)
  })

  test('no critical or serious violations inside `<main>`', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('#main-content')).toBeVisible()

    const results = await new AxeBuilder({ page })
      .include('main#main-content')
      /** Skip colour math on monochrome mock imagery / JL greys tuned in Figma; re-enable once tokens are audited. */
      .disableRules(['color-contrast'])
      .analyze()

    const severe = results.violations.filter((violation) =>
      ['critical', 'serious'].includes(violation.impact ?? ''),
    )

    expect(
      severe,
      severe.map((violation) => `${violation.id}: ${violation.help} — ${violation.nodes?.length} nodes`).join('\n'),
    ).toEqual([])
  })
})
