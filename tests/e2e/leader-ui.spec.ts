import { test, expect } from '@playwright/test'

async function login(page, id: string, password: string) {
  await page.goto('/login')
  const inputs = page.locator('input')
  await inputs.nth(0).fill(id)
  await inputs.nth(1).fill(password)
  await page.getByRole('button', { name: /登入/i }).click()
}

test.describe('Leader UI Rendering', () => {
    
  test('Leader sees dashboard page content', async ({ page }) => {
    await login(page, 'leader001', '123456')
    await expect(page).toHaveURL('/dashboard')

    await expect(page.getByRole('heading', { name: /任務儀錶板/ })).toBeVisible()
  })

  test('adds a new task named "test"', async ({page}) => {
      await login(page, 'leader001', '123456')
      await expect(page).toHaveURL('/dashboard')

      await page.getByRole('button', { name: '新增任務' }).click()
      await page.getByRole('combobox').click();
      await page.getByRole('option', { name: '電性測試' }).click();
      await page.getByPlaceholder('輸入任務名稱').fill('test')
      await page.getByRole('button', { name: '確定' }).click()
      await page.waitForTimeout(1000); 
      await expect(page.getByText('test')).toBeVisible()
  })

  test('auto-assign page should have "test" task', async ({page}) => {
      await login(page, 'leader001', '123456')
      await expect(page).toHaveURL('/dashboard')

      await page.getByRole('button', { name: '自動指派' }).click()
      await expect(page.getByText('test')).toBeVisible();
  })

  test('deletes the task named "test"', async ({ page }) => {
    await login(page, 'leader001', '123456')
    await expect(page).toHaveURL('/dashboard')
    
    const taskCard = page.getByText('test').locator('xpath=ancestor::div[contains(@class, "border")]');
    const editBtn = taskCard.locator('button:has(svg.lucide-pen)');

    await editBtn.click();

    await page.getByRole('button', { name: '刪除' }).click()
    await page.getByRole('button', { name: '確定刪除' }).click()

    await expect(page.getByText('test')).not.toBeVisible();
    })
})