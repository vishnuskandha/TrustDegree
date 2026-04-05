import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('loads without runtime errors and shows hero content', async ({ page }) => {
    const pageErrors: string[] = [];
    const consoleErrors: string[] = [];

    page.on('pageerror', (error) => {
      pageErrors.push(error.message);
    });

    page.on('console', (message) => {
      if (message.type() === 'error') {
        consoleErrors.push(message.text());
      }
    });

    await page.reload();

    await expect(page).toHaveURL('/');
    await expect(
      page.getByRole('heading', {
        level: 1,
        name: /trusted digital diplomas for everyone/i,
      })
    ).toBeVisible();
    await expect(page.getByText(/on-chain proof/i)).toBeVisible();

    expect(pageErrors).toEqual([]);
    expect(consoleErrors).toEqual([]);
  });

  test('renders key sections', async ({ page }) => {
    await expect(
      page.getByRole('heading', { name: /why choose trustdegree/i })
    ).toBeVisible();
    await expect(
      page.getByRole('heading', { name: /how it works in 4 easy steps/i })
    ).toBeVisible();
    await expect(
      page.getByRole('heading', {
        name: /ready to make your degrees trustworthy/i,
      })
    ).toBeVisible();
  });

  test('navigation links route to expected pages', async ({ page }) => {
    const openMenu = page.getByRole('button', { name: /open menu/i });
    if (await openMenu.isVisible()) {
      await openMenu.click();
    }

    await page.getByRole('link', { name: /^Verify$/i }).first().click();
    await expect(page).toHaveURL(/\/verify$/);

    await page.goto('/');
    if (await openMenu.isVisible()) {
      await openMenu.click();
    }
    await page.getByRole('link', { name: /how it works/i }).first().click();
    await expect(page).toHaveURL(/\/how-it-works$/);

    await page.goto('/');
    if (await openMenu.isVisible()) {
      await openMenu.click();
    }
    await page.getByRole('link', { name: /technical docs/i }).first().click();
    await expect(page).toHaveURL(/\/technical-docs$/);
  });

  test('hero calls to action route correctly', async ({ page }) => {
    await page.getByRole('link', { name: /try verification/i }).first().click();
    await expect(page).toHaveURL(/\/verify$/);

    await page.goto('/');
    await page.getByRole('link', { name: /for universities/i }).first().click();
    await expect(page).toHaveURL(/\/admin$/);
  });

  test('language switcher can toggle between English and Tamil', async ({ page }) => {
    const switcher = page.getByRole('button', { name: /select language/i });
    await expect(switcher).toBeVisible();

    await expect(switcher).toContainText(/english|en/i);
    await switcher.click();
    await page.getByRole('option', { name: /tamil|தமிழ்/i }).click();
    await expect(switcher).toContainText(/தமிழ்|ta/i);
    await expect(page.locator('html')).toHaveAttribute('lang', /^ta$/);

    const heroHeading = page.getByRole('heading', {
      level: 1,
      name: /trusted digital diplomas for everyone/i,
    });
    await expect(heroHeading).toBeVisible();
    const heroText = await heroHeading.textContent();
    expect(heroText ?? '').not.toMatch(/பதிப்பு வேண்டும்|வேendent|acquired/i);

    await page.reload();
    await expect(switcher).toContainText(/தமிழ்|ta/i);
    await expect(page.locator('html')).toHaveAttribute('lang', /^ta$/);

    await switcher.click();
    await page.getByRole('option', { name: /english/i }).click();
    await expect(switcher).toContainText(/english|en/i);
    await expect(page.locator('html')).toHaveAttribute('lang', /^en$/);
  });

  test('shows actionable links and buttons', async ({ page }) => {
    const controls = page.locator('a:visible, button:visible');
    await expect(controls.first()).toBeVisible();
    expect(await controls.count()).toBeGreaterThan(5);
  });

  test('has no horizontal overflow on mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    const hasHorizontalOverflow = await page.evaluate(() => {
      const root = document.documentElement;
      return root.scrollWidth > root.clientWidth;
    });

    expect(hasHorizontalOverflow).toBe(false);
  });

  test('includes title and description metadata', async ({ page }) => {
    await expect(page).toHaveTitle(/trustdegree/i);

    const metaDescription = await page
      .locator('meta[name="description"]')
      .getAttribute('content');
    expect(metaDescription).toBeTruthy();
    expect((metaDescription ?? '').length).toBeGreaterThan(20);
  });

  test('supports keyboard focus navigation', async ({ page }) => {
    await page.keyboard.press('Tab');
    const focused = await page.evaluate(() => {
      const active = document.activeElement as HTMLElement | null;
      if (!active) {
        return null;
      }

      return {
        tag: active.tagName,
        tabIndex: active.tabIndex,
      };
    });

    expect(focused).not.toBeNull();
    expect(focused?.tag).not.toBe('BODY');
    expect(focused?.tabIndex ?? -1).toBeGreaterThanOrEqual(0);
  });
});
