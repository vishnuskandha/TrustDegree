import { test, expect } from '@playwright/test';

const viewports = [
  { name: 'Mobile S', width: 320, height: 568 },
  { name: 'Mobile M', width: 375, height: 667 },
  { name: 'Tablet', width: 768, height: 1024 },
  { name: 'Desktop', width: 1440, height: 900 },
];

async function hasHorizontalOverflow(page: import('@playwright/test').Page) {
  return page.evaluate(() => {
    const root = document.documentElement;
    return root.scrollWidth > root.clientWidth;
  });
}

test.describe('Responsive Design', () => {
  test.describe('Layout', () => {
    viewports.forEach((viewport) => {
      test(`renders homepage correctly on ${viewport.name}`, async ({ page }) => {
        await page.setViewportSize({ width: viewport.width, height: viewport.height });
        await page.goto('/');

        await expect(page).toHaveURL('/');
        await expect(page.locator('main#main-content')).toBeVisible();
        expect(await hasHorizontalOverflow(page)).toBe(false);
      });
    });

    test('issue and verify pages do not overflow on mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });

      await page.goto('/issue');
      expect(await hasHorizontalOverflow(page)).toBe(false);

      await page.goto('/verify');
      expect(await hasHorizontalOverflow(page)).toBe(false);
    });
  });

  test.describe('Navigation', () => {
    test('mobile navigation controls meet touch target minimums', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/');

      const controls = page.locator('nav a:visible, nav button:visible');
      const total = await controls.count();
      expect(total).toBeGreaterThan(0);

      for (let i = 0; i < Math.min(total, 6); i += 1) {
        const box = await controls.nth(i).boundingBox();
        if (!box) {
          continue;
        }
        expect(box.width).toBeGreaterThanOrEqual(44);
        expect(box.height).toBeGreaterThanOrEqual(44);
      }
    });
  });

  test.describe('Forms', () => {
    test('issue form inputs meet minimum touch height', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/issue');

      const inputs = page.locator('input:visible');
      for (let i = 0; i < Math.min(4, await inputs.count()); i += 1) {
        const input = inputs.nth(i);
        const box = await input.boundingBox();

        if (!box) {
          continue;
        }

          expect(box.height).toBeGreaterThanOrEqual(44);
      }
    });

    test('verify page form remains usable on mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/verify');

      await expect(page.getByLabel(/smart contract address/i)).toBeVisible();
      await expect(page.getByLabel(/diploma number/i)).toBeVisible();
      await expect(page.getByRole('button', { name: /check diploma authenticity/i })).toBeVisible();
    });
  });

  test.describe('Performance', () => {
    test('homepage loads within acceptable time', async ({ page }) => {
      const startTime = Date.now();
      await page.goto('/');
      const loadTime = Date.now() - startTime;

      expect(loadTime).toBeLessThan(10000);
    });
  });

  test.describe('Accessibility', () => {
    test('interactive elements are keyboard focusable', async ({ page }) => {
      await page.goto('/');

      await page.keyboard.press('Tab');

      const focusedElement = await page.evaluate(() => {
        const active = document.activeElement as HTMLElement | null;
        if (!active) {
          return null;
        }

        return {
          tag: active.tagName,
          tabIndex: active.tabIndex,
        };
      });

      expect(focusedElement).not.toBeNull();
      expect(focusedElement?.tag).not.toBe('BODY');
      expect(focusedElement?.tabIndex ?? -1).toBeGreaterThanOrEqual(0);
    });

    test('interactive icons are either decorative or properly labeled', async ({ page }) => {
      await page.goto('/');

      const violations = await page.evaluate(() => {
        const interactiveElements = Array.from(document.querySelectorAll('a, button'));
        const icons = interactiveElements.flatMap((element) =>
          Array.from(element.querySelectorAll('svg'))
        );

        const visibleIcons = icons.filter((icon) => {
          const rect = icon.getBoundingClientRect();
          return rect.width > 0 && rect.height > 0;
        });

        return visibleIcons.filter((icon) => {
          const hasAccessibleName = Boolean(icon.getAttribute('aria-label')) || Boolean(icon.querySelector('title'));
          const isDecorative = icon.getAttribute('aria-hidden') === 'true';
          return !hasAccessibleName && !isDecorative;
        }).length;
      });

      expect(violations).toBe(0);
    });
  });
});
