import { test, expect } from '@playwright/test'

test.describe('Login Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login')
  })

  test('renders login form', async ({ page }) => {
    const accountInput = page.locator('label:has-text("帳號")').locator('..').locator('input')
    const passwordInput = page.locator('label:has-text("密碼")').locator('..').locator('input')

    await expect(accountInput).toBeVisible()
    await expect(passwordInput).toBeVisible()
    await expect(page.getByRole('button', { name: /登入/i })).toBeVisible()
  })

  test('fails with invalid credentials and shows toast', async ({ page }) => {
    const accountInput = page.locator('label:has-text("帳號")').locator('..').locator('input')
    const passwordInput = page.locator('label:has-text("密碼")').locator('..').locator('input')

    await accountInput.fill('wronguser')
    await passwordInput.fill('wrongpass')
    await page.getByRole('button', { name: /登入/i }).click()

    const toast = page.locator('li[role="alert"][title="登入失敗"]')
    await expect(toast).toBeVisible()

    await expect(page).toHaveURL('/login')
  })

  test('succeeds with valid credentials and redirects', async ({ page }) => {
    const accountInput = page.locator('label:has-text("帳號")').locator('..').locator('input')
    const passwordInput = page.locator('label:has-text("密碼")').locator('..').locator('input')

    await accountInput.fill('admin001')
    await passwordInput.fill('123456')
    await page.getByRole('button', { name: /登入/i }).click()

    await expect(page).toHaveURL(/\/(admin|dashboard|task)$/)
  })

  test('logs out after login and redirects to login page', async ({ page }) => {
  const accountInput = page.locator('label:has-text("帳號")').locator('..').locator('input')
  const passwordInput = page.locator('label:has-text("密碼")').locator('..').locator('input')

  await accountInput.fill('admin001')
  await passwordInput.fill('123456')
  await page.getByRole('button', { name: /登入/i }).click()
  await expect(page).toHaveURL('/admin')

  await page.getByText('lab11@admin001', { exact: true }).click()
  await page.getByRole('menuitem', { name: '登出' }).click()

  await expect(page).toHaveURL('/login')

  const token = await page.evaluate(() => localStorage.getItem('token'))
  expect(token).toBeNull()
})
})
