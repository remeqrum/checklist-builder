import { expect, test } from '@playwright/test';

test('create checklist, add a block, survive reload, export to Excel', async ({ page }) => {
  await page.goto('/');

  page.once('dialog', (dialog) => dialog.accept('Smoke Checklist'));
  await page.getByRole('button', { name: 'Create New' }).click();

  await expect(page).toHaveURL(/\/checklist\//);
  await expect(page.getByRole('heading', { name: 'Smoke Checklist' })).toBeVisible();

  // add the Authentication template block from the sidebar
  await page.getByRole('button', { name: /Authentication/ }).click();
  await expect(page.getByText('Login with valid credentials')).toBeVisible();

  // F5 must keep the user inside the builder (URL routing)
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Smoke Checklist' })).toBeVisible();
  await expect(page.getByText('Login with valid credentials')).toBeVisible();

  // export downloads an .xlsx named after the checklist
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export .xlsx' }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toMatch(/^Smoke Checklist_\d{4}-\d{2}-\d{2}\.xlsx$/);
});

test('inline rename for checklist and section persists', async ({ page }) => {
  await page.goto('/');

  page.once('dialog', (dialog) => dialog.accept('Rename Me'));
  await page.getByRole('button', { name: 'Create New' }).click();
  await expect(page).toHaveURL(/\/checklist\//);

  page.once('dialog', (dialog) => dialog.accept('Section One'));
  await page.getByRole('button', { name: 'Add Section' }).click();
  await expect(page.getByText('Section One')).toBeVisible();

  // checklist renames on click
  await page.locator('header').getByTitle('Click to rename', { exact: true }).click();
  await page.locator('header input').fill('Renamed List');
  await page.locator('header input').press('Enter');
  await expect(page.getByRole('heading', { name: 'Renamed List' })).toBeVisible();

  // section renames on double click
  await page.getByText('Section One').dblclick();
  await page.locator('input:focus').fill('Section Two');
  await page.locator('input:focus').press('Enter');
  await expect(page.getByText('Section Two')).toBeVisible();

  await page.reload();
  await expect(page.getByRole('heading', { name: 'Renamed List' })).toBeVisible();
  await expect(page.getByText('Section Two')).toBeVisible();
});

test('test case can be added and deleted with confirmation', async ({ page }) => {
  await page.goto('/');

  page.once('dialog', (dialog) => dialog.accept('Case Flow'));
  await page.getByRole('button', { name: 'Create New' }).click();

  page.once('dialog', (dialog) => dialog.accept('Main'));
  await page.getByRole('button', { name: 'Add Section' }).click();

  await page.getByTitle('Add test case').click();
  await expect(page.getByText('New test case')).toBeVisible();

  page.once('dialog', (dialog) => {
    expect(dialog.message()).toContain('New test case');
    void dialog.accept();
  });
  await page.getByTitle('Delete test case').click();
  await expect(page.getByText('New test case')).toHaveCount(0);
});

test('dashboard duplicates and deletes checklists', async ({ page }) => {
  await page.goto('/');

  page.once('dialog', (dialog) => dialog.accept('Dash List'));
  await page.getByRole('button', { name: 'Create New' }).click();
  await page.getByTitle('Back to Dashboard').click();
  await expect(page.getByText('Dash List')).toBeVisible();

  await page.getByTitle('Duplicate').click();
  await expect(page.getByText('Dash List (copy)')).toBeVisible();

  page.once('dialog', (dialog) => void dialog.accept());
  await page
    .locator('div.group', { hasText: 'Dash List (copy)' })
    .getByTitle('Delete')
    .click();
  await expect(page.getByText('Dash List (copy)')).toHaveCount(0);
  await expect(page.getByText('Dash List')).toBeVisible();
});
