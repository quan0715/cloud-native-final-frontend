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

  test('adds a new machine named "test"', async ({page}) => {
    await login(page, 'admin001', '123456')
    await expect(page).toHaveURL('/admin')

    await page.getByRole('tab', { name: '機器管理' }).click()
    await page.getByRole('button', { name: '新增機器' }).click()
    await page.getByPlaceholder('機器名稱').fill('test')
    await page.getByRole('button', { name: '確定' }).click()
    await expect(page.getByText('test')).toBeVisible()
  })

  test('deletes the machine named "test"', async ({ page }) => {
  await login(page, 'admin001', '123456')
  await expect(page).toHaveURL('/admin')

  await page.getByRole('tab', { name: '機器管理' }).click()

  const card = page.locator('text=test').locator('xpath=ancestor::div[contains(@class, "border-2")]');
  const deleteBtn = card.locator('button:has(svg.lucide-trash)');

  await deleteBtn.click();

  const confirmBtn = page.getByRole('button', { name: '確定' });
  await expect(confirmBtn).toBeVisible();
  await confirmBtn.click();

  await expect(page.getByText('test')).not.toBeVisible();
  })

  test('adds a new task type named "test"', async ({page}) => {
    await login(page, 'admin001', '123456')
    await expect(page).toHaveURL('/admin')

    await page.getByRole('tab', { name: '任務類型管理' }).click()
    await page.getByRole('button', { name: '新增任務類型' }).click()
    await page.getByPlaceholder('如：電性測試').fill('test')
    const numberInput = page.locator('input[type="number"]');
    await numberInput.fill('1');
    await page.getByRole('button', { name: '確定' }).click()
    await expect(page.getByText('test')).toBeVisible()
  })

  test('deletes the task type named "test"', async ({ page }) => {
  await login(page, 'admin001', '123456')
  await expect(page).toHaveURL('/admin')
  
  await page.getByRole('tab', { name: '任務類型管理' }).click()

  const card = page.locator('text=test').locator('xpath=ancestor::div[contains(@class, "border-2")]');
  const deleteBtn = card.locator('button:has(svg.lucide-trash)');

  await deleteBtn.click();

  const confirmBtn = page.getByRole('button', { name: '確定' });
  await expect(confirmBtn).toBeVisible();
  await confirmBtn.click();

  await expect(page.getByText('test')).not.toBeVisible();
  })
})