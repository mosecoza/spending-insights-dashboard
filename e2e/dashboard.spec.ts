import { expect, test } from '@playwright/test';

test('filters transactions, paginates, and restores filter state from the URL', async ({
  page,
}) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Monthly trends' })).toBeVisible();
  await page.getByRole('tab', { name: '30d' }).focus();
  await page.keyboard.press('ArrowRight');
  await expect(page.getByRole('tab', { name: '90d' })).toHaveAttribute('aria-selected', 'true');
  await expect(page).toHaveURL(/period=90d/);
  await page.getByRole('combobox', { name: 'Trend months' }).selectOption('6');
  await expect(page).toHaveURL(/months=6/);

  await page.getByRole('combobox', { name: 'Filter by category' }).selectOption('Groceries');
  await page.getByRole('combobox', { name: 'Sort' }).selectOption('amount_desc');
  await page.getByRole('combobox', { name: 'Rows per page' }).selectOption('10');
  await expect(page.getByText(/Page 1 of/)).toBeVisible();

  await page.getByRole('button', { name: 'Next' }).click();
  await expect(page.getByText(/Page 2 of/)).toBeVisible();
  await expect(page).toHaveURL(/category=Groceries/);
  await expect(page).toHaveURL(/sortBy=amount_desc/);
  await expect(page).toHaveURL(/limit=10/);
  await expect(page).toHaveURL(/page=1/);
  await expect(page).toHaveURL(/months=6/);

  await page.reload();
  await expect(page.getByRole('combobox', { name: 'Filter by category' })).toHaveValue('Groceries');
  await expect(page.getByRole('combobox', { name: 'Sort' })).toHaveValue('amount_desc');
  await expect(page.getByRole('combobox', { name: 'Rows per page' })).toHaveValue('10');
  await expect(page.getByRole('combobox', { name: 'Trend months' })).toHaveValue('6');
  await expect(page.getByText(/Page 2 of/)).toBeVisible();

  await page.evaluate(() => {
    window.history.pushState({}, '', '/?period=7d');
    window.dispatchEvent(new PopStateEvent('popstate'));
  });
  await expect(page.getByRole('combobox', { name: 'Filter by category' })).toHaveValue('');
  await expect(page.getByRole('combobox', { name: 'Sort' })).toHaveValue('date_desc');
  await expect(page.getByRole('combobox', { name: 'Rows per page' })).toHaveValue('20');
  await expect(page.getByRole('combobox', { name: 'Trend months' })).toHaveValue('12');
  await expect(page.getByText(/Page 1 of/)).toBeVisible();
});
