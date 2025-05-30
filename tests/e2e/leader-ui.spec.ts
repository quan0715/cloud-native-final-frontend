import { test, expect } from '@playwright/test'

async function login(page, id: string, password: string) {
  await page.goto('/login')
  const inputs = page.locator('input')
  await inputs.nth(0).fill(id)
  await inputs.nth(1).fill(password)
  await page.getByRole('button', { name: /登入/i }).click()
}

test.describe('Leader UI Rendering', () => {
    
  test('Admin sees admin page content', async ({ page }) => {
    await login(page, 'admin001', '123456')
    await expect(page).toHaveURL('/admin')

    await expect(page.getByRole('heading', { name: /管理員儀錶板/ })).toBeVisible()
  })
})