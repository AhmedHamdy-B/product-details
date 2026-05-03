import { test, expect } from '@playwright/test'

import { clearClientStorage } from './helpers/clear-site-data'
import { mockEasyOrdersProductPayload } from './helpers/mock-easyorders'

test.describe('PDP chrome', () => {
  test.beforeEach(async ({ page }) => {
    await clearClientStorage(page)
    await mockEasyOrdersProductPayload(page)
  })

  test('loads hero, validates add-to-cart, opens basket drawer', async ({ page }) => {
    await page.goto('/')

    await expect(page.getByRole('heading', { level: 1, name: /Hybrid Trainer/i })).toBeVisible()
    await expect(page.getByRole('main')).toBeVisible()

    await page.getByRole('button', { name: /add to cart/i }).click()
    await expect(page.getByText(/added to cart/i)).toBeVisible()
    await expect(page.getByText(/1 item in your basket/i)).toBeVisible()

    await page.getByRole('button', { name: /basket/i }).click()
    /** Headless UI mounts the dialog root before panels finish painting — assert on surfaced copy instead. */
    await expect(page.getByText(/^Your basket$/i).first()).toBeVisible()
    await expect(page.getByText(/Hybrid Trainer/i).first()).toBeVisible()
  })

  test('keyboard: skip link is the first focus stop', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
    await page.keyboard.press('Tab')
    await expect(page.getByRole('link', { name: /skip to main content/i })).toBeFocused()
  })
})
