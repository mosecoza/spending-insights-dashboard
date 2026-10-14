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

test('switches customers and resets dashboard filters', async ({ page }) => {
  await page.goto(
    '/?period=90d&startDate=2024-07-01&endDate=2024-09-01&category=Groceries&months=6',
  );
  await expect(page.getByRole('combobox', { name: 'Customer' })).toHaveValue('12345');
  await expect(page.getByRole('combobox', { name: 'Filter by category' })).toHaveValue('Groceries');

  await page.getByRole('combobox', { name: 'Customer' }).selectOption('67890');

  await expect(page.getByRole('heading', { name: 'Ayesha Khan' })).toBeVisible();
  await expect(page.getByRole('combobox', { name: 'Customer' })).toHaveValue('67890');
  await expect(page.getByRole('combobox', { name: 'Filter by category' })).toHaveValue('');
  await expect(page.getByRole('combobox', { name: 'Trend months' })).toHaveValue('12');
  await expect(page).toHaveURL('/');
});

test('shows an actionable empty state when transaction filters match no rows', async ({ page }) => {
  await page.goto('/?startDate=2020-01-01&endDate=2020-01-02&category=Groceries');

  await expect(page.getByText('No transactions match these filters.')).toBeVisible();
  await page.getByRole('button', { name: 'Clear filters' }).click();

  await expect(page.getByText('Page 1 of', { exact: false })).toBeVisible();
  await expect(page.getByText('No transactions match these filters.')).not.toBeVisible();
  await expect(page).toHaveURL('/');
});
