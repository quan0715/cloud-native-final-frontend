import { test, expect } from '@playwright/test'

async function login(page, id: string, password: string) {
  await page.goto('/login')
  const inputs = page.locator('input')
  await inputs.nth(0).fill(id)
  await inputs.nth(1).fill(password)
  await page.getByRole('button', { name: /登入/i }).click()
}

test('unauthenticated access to /dashboard redirects to /login', async ({ page }) => {
  await page.goto('/dashboard')
  await expect(page).toHaveURL('/login')
  const toast = page.locator('li[role="alert"][title="請先登入"]')
  await expect(toast).toBeVisible()
})

test('admin user redirects to /admin', async ({ page }) => {
  await login(page, 'admin001', '123456')
  await expect(page).toHaveURL('/admin')
})

test('leader user redirects to /dashboard', async ({ page }) => {
  await login(page, 'leader001', '123456')
  await expect(page).toHaveURL('/dashboard')
})

test('worker user redirects to /task', async ({ page }) => {
  await login(page, 'worker001', '123456')
  await expect(page).toHaveURL('/task')
})

test('worker cannot access /admin and is redirected back with toast', async ({ page }) => {
  await login(page, 'worker001', '123456')
  await expect(page).toHaveURL('/task')

  await page.goto('/admin')
  await expect(page).toHaveURL('/task')
  const toast = page.locator('li[role="alert"][title="您沒有權限訪問此頁面。"]')
  await expect(toast).toBeVisible()
})

test('logged-in user trying to access /login is redirected to default route', async ({ page }) => {
  await login(page, 'leader001', '123456')
  await expect(page).toHaveURL('/dashboard')

  await page.goto('/login')
  await expect(page).toHaveURL('/dashboard')
  const toast = page.locator('li[role="alert"][title="您已經登入了，進入對應的頁面"]')
  await expect(toast).toBeVisible()
})
