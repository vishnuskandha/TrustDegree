import { test, expect } from '@playwright/test';

async function fillValidIssueForm(page: import('@playwright/test').Page) {
  await page.getByLabel(/student full name/i).fill('Jane Doe');
  await page
    .getByLabel(/wallet address/i)
    .fill('0x742d35Cc6634C0532925a3b8D4C9db96C4b4Db45');
  await page.getByLabel(/university \/ institution/i).fill('Demo University');

  await page.getByRole('button', { name: /select a degree type/i }).click();
  await page.getByRole('button', { name: /bachelor's degree/i }).click();

  await page.getByLabel(/graduation year/i).fill('2024');
}

test.describe('Issue Credential Flow', () => {
  test('renders issue form and required controls', async ({ page }) => {
    await page.goto('/issue');

    await expect(page).toHaveURL(/\/issue$/);
    await expect(page.getByRole('heading', { name: /create digital credential/i })).toBeVisible();
    await expect(page.getByLabel(/student full name/i)).toBeVisible();
    await expect(page.getByLabel(/wallet address/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /create credential/i })).toBeVisible();
  });

  test('create button is disabled until form is valid', async ({ page }) => {
    await page.goto('/issue');

    const createButton = page.getByRole('button', { name: /create credential/i });
    await expect(createButton).toBeDisabled();

    await fillValidIssueForm(page);
    await expect(createButton).toBeEnabled();
  });

  test('shows validation feedback for invalid wallet address', async ({ page }) => {
    await page.goto('/issue');

    await page.getByLabel(/wallet address/i).fill('invalid-address');
    await page.getByLabel(/student full name/i).click();
    await expect(page.getByText(/invalid ethereum address format/i)).toBeVisible();
  });

  test('auto-saves draft data to localStorage', async ({ page }) => {
    await page.goto('/issue');

    await page.getByLabel(/student full name/i).fill('Draft User');
    await expect
      .poll(async () =>
        page.evaluate(() => localStorage.getItem('trustdegree-issue-draft'))
      )
      .not.toBeNull();

    const draft = await page.evaluate(() => {
      const raw = localStorage.getItem('trustdegree-issue-draft');
      return raw ? JSON.parse(raw) : null;
    });

    expect(draft).toBeTruthy();
    expect(draft.studentName).toBe('Draft User');
  });

  test('restores saved draft on revisit', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem(
        'trustdegree-issue-draft',
        JSON.stringify({
          studentName: 'Saved Draft',
          studentAddress: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4Db45',
          university: 'Draft University',
          degreeType: 'Bachelor',
          graduationYear: '2024',
          metadataUri: '',
        })
      );
    });

    await page.goto('/issue');
    await expect(page.getByLabel(/student full name/i)).toHaveValue('Saved Draft');
    await expect(page.getByLabel(/wallet address/i)).toHaveValue(
      '0x742d35Cc6634C0532925a3b8D4C9db96C4b4Db45'
    );
    await expect(page.getByLabel(/university \/ institution/i)).toHaveValue('Draft University');
    await expect(page.getByLabel(/graduation year/i)).toHaveValue('2024');

    const degreeTypeButton = page
      .locator('label:has-text("Degree Type")')
      .locator('xpath=following-sibling::div[1]//button');
    await expect(degreeTypeButton).toContainText(/bachelor/i);
  });

  test('opens confirmation modal and completes issuance flow', async ({ page }) => {
    await page.goto('/issue');
    await fillValidIssueForm(page);

    await page.getByRole('button', { name: /create credential/i }).click();
    await expect(page.getByText(/create digital credential\?/i)).toBeVisible();

    await page.getByRole('button', { name: /^Create$/ }).click();

    await expect(page.getByRole('heading', { name: /credential created!/i })).toBeVisible({ timeout: 10000 });
    await expect(page.getByText(/verification details/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /share/i })).toBeVisible();
  });

  test('clear action resets form and removes draft', async ({ page }) => {
    await page.goto('/issue');

    await page.getByLabel(/student full name/i).fill('Temporary Student');
    await expect
      .poll(async () =>
        page.evaluate(() => localStorage.getItem('trustdegree-issue-draft'))
      )
      .not.toBeNull();

    await page.getByRole('button', { name: /^Clear$/i }).click();

    await expect(page.getByLabel(/student full name/i)).toHaveValue('');

    await expect
      .poll(async () =>
        page.evaluate(() => localStorage.getItem('trustdegree-issue-draft'))
      )
      .toBeNull();
  });
});
