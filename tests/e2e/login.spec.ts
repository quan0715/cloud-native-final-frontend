import { test, expect } from '@playwright/test'

test.describe('Login Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login')
  })

  test('renders login form', async ({ page }) => {
    await expect(page.locator('input[type="text"]')).toBeVisible()
    await expect(page.locator('input[type="password"]')).toBeVisible()
    await expect(page.getByRole('button', { name: /登入/i })).toBeVisible()
  })

  test('fails with invalid credentials', async ({ page }) => {
    await page.locator('input[type="text"]').fill('wronguser')
    await page.locator('input[type="password"]').fill('wrongpass')
    await page.getByRole('button', { name: /登入/i }).click()

    page.on('dialog', async (dialog) => {
      expect(dialog.message()).toContain('帳號: wronguser')
      await dialog.dismiss()
    })
  })

  test('redirects on successful login', async ({ page }) => {
    await page.locator('input[type="text"]').fill('admin@example.com')
    await page.locator('input[type="password"]').fill('correctpass')
    await page.getByRole('button', { name: /登入/i }).click()

    await expect(page).toHaveURL(/\/$/)
  })
})
