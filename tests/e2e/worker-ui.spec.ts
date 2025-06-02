import { test, expect } from '@playwright/test'

async function login(page, id: string, password: string) {
  await page.goto('/login')
  const inputs = page.locator('input')
  await inputs.nth(0).fill(id)
  await inputs.nth(1).fill(password)
  await page.getByRole('button', { name: /登入/i }).click()
}

test.describe('Worker UI Rendering', () => {

  test('Worker sees task page content', async ({ page }) => {
    await login(page, 'worker001', '123456')
    await expect(page).toHaveURL('/task')

    await expect(page.getByRole('heading', { name: /個人任務管理/ })).toBeVisible()
  })
})