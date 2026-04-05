import { test, expect } from '@playwright/test';

const SAMPLE_CONTRACT = '0x5cB91F46836a9493526859234e628Ec2A3592618';
const SAMPLE_TOKEN = '12345';

const sampleDegreeResponse = {
  valid: true,
  tokenId: SAMPLE_TOKEN,
  contractAddress: SAMPLE_CONTRACT,
  student: {
    address: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4Db45',
    name: 'Jane Student',
  },
  degree: {
    university: 'Test University',
    type: "Bachelor's Degree",
    graduationYear: '2024',
  },
  issuedAt: '2026-01-10T10:00:00.000Z',
  metadataUri: 'ipfs://example',
  txHash: '0xabc123abc123abc123abc123abc123abc123abc123abc123abc123abc123abcd',
};

async function mockVerifyApi(page: import('@playwright/test').Page) {
  await page.route('**/api/verify/**', async (route) => {
    const url = new URL(route.request().url());

    if (url.pathname.endsWith('/api/verify/sample')) {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          contractAddress: SAMPLE_CONTRACT,
          tokenId: SAMPLE_TOKEN,
        }),
      });
      return;
    }

    const match = url.pathname.match(/\/api\/verify\/([^/]+)\/([^/]+)$/);
    if (!match) {
      await route.fulfill({
        status: 404,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'Not found' }),
      });
      return;
    }

    const contract = decodeURIComponent(match[1]);
    const tokenId = decodeURIComponent(match[2]);

    if (
      contract.toLowerCase() === SAMPLE_CONTRACT.toLowerCase() &&
      tokenId === SAMPLE_TOKEN
    ) {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(sampleDegreeResponse),
      });
      return;
    }

    await route.fulfill({
      status: 404,
      contentType: 'application/json',
      body: JSON.stringify({ message: 'Credential not found' }),
    });
  });
}

async function submitVerificationForm(page: import('@playwright/test').Page, token = SAMPLE_TOKEN) {
  await page.getByLabel(/smart contract address/i).fill(SAMPLE_CONTRACT);
  await page.getByLabel(/diploma number/i).fill(token);
  await page.getByRole('button', { name: /check diploma authenticity/i }).click();
}

test.describe('Verify Credential Flow', () => {
  test.beforeEach(async ({ page }) => {
    await mockVerifyApi(page);
    await page.goto('/verify');
  });

  test('renders verify page with manual mode defaults', async ({ page }) => {
    await expect(page).toHaveURL(/\/verify$/);
    await expect(
      page.getByRole('heading', { name: /check diploma authenticity/i })
    ).toBeVisible();
    await expect(page.getByLabel(/smart contract address/i)).toBeVisible();
    await expect(page.getByLabel(/diploma number/i)).toBeVisible();
  });

  test('verifies a valid credential and shows details', async ({ page }) => {
    await submitVerificationForm(page);

    await expect(page.getByText(/this degree is genuine/i)).toBeVisible();
    await expect(page.getByText('Jane Student').first()).toBeVisible();
    await expect(page.getByText(/test university/i).first()).toBeVisible();
    await expect(page.getByRole('button', { name: /copy verification link/i })).toBeVisible();
  });

  test('shows not found error for unknown credential', async ({ page }) => {
    await submitVerificationForm(page, '99999');

    await expect(page.getByRole('alert')).toBeVisible();
    await expect(page.getByText(/diploma not found/i)).toBeVisible();
  });

  test('try sample button fetches and verifies sample credential', async ({ page }) => {
    await page.getByRole('button', { name: /try sample diploma/i }).click();

    await expect(page.getByLabel(/smart contract address/i)).toHaveValue(SAMPLE_CONTRACT);
    await expect(page.getByLabel(/diploma number/i)).toHaveValue(SAMPLE_TOKEN);
    await expect(page.getByText(/this degree is genuine/i)).toBeVisible();
  });

  test('qr mode can start and cancel scanner session', async ({ page }) => {
    await page.getByRole('button', { name: /scan qr code/i }).click();
    await page.getByRole('button', { name: /start scanning/i }).click();
    await expect(page.getByRole('button', { name: /cancel scanning/i })).toBeVisible();

    await page.getByRole('button', { name: /cancel scanning/i }).click();
    await expect(page.getByRole('button', { name: /start scanning/i })).toBeVisible();
  });

  test('stores successful verification in history', async ({ page }) => {
    await submitVerificationForm(page);

    await expect(page.getByText(/recent checks/i)).toBeVisible();
    const history = await page.evaluate(() => {
      const raw = localStorage.getItem('trustdegree_verify_history');
      return raw ? JSON.parse(raw) : [];
    });

    expect(history.length).toBeGreaterThan(0);
    expect(history[0]?.contract?.toLowerCase()).toBe(SAMPLE_CONTRACT.toLowerCase());
    expect(history[0]?.tokenId).toBe(SAMPLE_TOKEN);
  });

  test('verify page remains usable on mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/verify');

    await expect(page.getByLabel(/smart contract address/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /check diploma authenticity/i })).toBeVisible();
  });
});
