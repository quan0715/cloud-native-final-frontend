import { test, expect } from '@playwright/test'

async function login(page, id: string, password: string) {
  await page.goto('/login')
  const inputs = page.locator('input')
  await inputs.nth(0).fill(id)
  await inputs.nth(1).fill(password)
  await page.getByRole('button', { name: /登入/i }).click()
}

test.describe('Admin UI Rendering', () => {

  test('Admin sees admin page content', async ({ page }) => {
    await login(page, 'admin001', '123456')
    await expect(page).toHaveURL('/admin')

    await expect(page.getByRole('heading', { name: /管理員儀錶板/ })).toBeVisible()
  })

  /*test('adds a new machine named "test"', async ({page}) => {
    await login(page, 'admin001', '123456')
    await expect(page).toHaveURL('/admin')

    await page.getByRole('tab', { name: '機器管理' }).click()
    await page.getByRole('button', { name: '新增機器' }).click()
    await page.getByPlaceholder('機器名稱').fill('test')
    await page.getByRole('button', { name: '確定' }).click()
    await expect(page.getByText('test')).toBeVisible()
  })

  test('delete the machine named "test"', async ({ page }) => {
  await login(page, 'admin001', '123456')
  await page.getByRole('tab', { name: '機器管理' }).click()

  const card = page.getByText('test', { exact: true }).locator('xpath=ancestor::div[contains(@class, "border-gray-200")]')
  await expect(card).toBeVisible()

  const deleteButton = card.locator('button.text-red-600')
  await deleteButton.click({ force: true })

  await expect(page.getByRole('dialog')).toBeVisible()
  await page.getByRole('button', { name: '確定' }).click()

  await expect(page.getByText('test')).toHaveCount(0)
  })*/

})