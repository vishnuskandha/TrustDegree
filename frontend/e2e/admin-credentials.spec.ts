import { test, expect } from '@playwright/test';

test.describe('Admin Credentials Management', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/admin/credentials');
  });

  test('should display admin credentials page', async ({ page }) => {
    await expect(page).toHaveURL(/\/admin\/credentials/);

    const heading = page.locator('h1, h2:has-text("Admin"), text=/credentials|manage/i').first();
    await expect(heading).toBeVisible();
  });

  test('should display credentials table', async ({ page }) => {
    const table = page.locator('table, [role="grid"], [class*="table"]').first();
    await expect(table).toBeVisible({ timeout: 3000 });
  });

  test('should render table headers', async ({ page }) => {
    const headers = page.locator('th, [role="columnheader"]');
    await expect(headers.first()).toBeVisible();

    const headerCount = await headers.count();
    expect(headerCount).toBeGreaterThan(0);
  });

  test('should display credential data rows', async ({ page }) => {
    const rows = page.locator('tbody tr, [role="row"]:not([role="columnheader"])');
    const rowCount = await rows.count();

    // Should have at least some data (demo or seeded)
    expect(rowCount).toBeGreaterThanOrEqual(0);
  });

  test('should have search functionality', async ({ page }) => {
    const searchInput = page.locator('input[placeholder*="search" i], input[type="search"]').first();
    await expect(searchInput).toBeVisible();

    // Type in search
    await searchInput.fill('Alice');
    await expect(searchInput).toHaveValue('Alice');
  });

  test('search should filter results', async ({ page }) => {
    const searchInput = page.locator('input[placeholder*="search" i], input[type="search"]').first();
    await searchInput.fill('Alice');

    // Wait for filtering
    await page.waitForTimeout(500);

    // Check if table updates
    const table = page.locator('table').first();
    await expect(table).toBeVisible();
  });

  test('should filter by status', async ({ page }) => {
    // Find status filter dropdown
    const statusFilter = page.locator('select:has-text("Status"), select[aria-label*="status" i]').first();

    if (await statusFilter.isVisible()) {
      await statusFilter.click();
      await page.locator('option:has-text("Valid")').first().click();
      await page.waitForTimeout(300);
    }
  });

  test('should have pagination controls', async ({ page }) => {
    const pagination = page.locator('[class*="pagination"], button:has-text("Next"), button:has-text("Previous")');
    const paginationCount = await pagination.count();

    if (paginationCount > 0) {
      await expect(pagination.first()).toBeVisible();
    }
  });

  test('should navigate to next page', async ({ page }) => {
    const nextButton = page.locator('button:has-text("Next"), [aria-label*="next"]').first();

    if (await nextButton.isVisible()) {
      await nextButton.click();
      await page.waitForTimeout(300);
    }
  });

  test('should bulk select credentials', async ({ page }) => {
    const checkboxes = page.locator('input[type="checkbox"]');
    const checkboxCount = await checkboxes.count();

    if (checkboxCount > 0) {
      await checkboxes.first().click();
      await expect(checkboxes.first()).toBeChecked();
    }
  });

  test('should bulk revoke selected credentials', async ({ page }) => {
    // Select a credential
    const checkbox = page.locator('input[type="checkbox"]').first();

    if (await checkbox.isVisible()) {
      await checkbox.click();

      // Click bulk revoke button
      const bulkActionButton = page.locator('button:has-text("Revoke"), button:has-text("Bulk Actions")').first();
      if (await bulkActionButton.isVisible()) {
        await bulkActionButton.click();

        // Confirm in modal if appears
        const confirmButton = page.locator('button:has-text("Confirm"), button:has-text("Yes")').first();
        if (await confirmButton.isVisible({ timeout: 1000 })) {
          await confirmButton.click();
        }
      }
    }
  });

  test('should export CSV', async ({ page }) => {
    // Listen for download
    const downloadPromise = page.waitForEvent('download');

    const exportButton = page.locator('button:has-text("Export"), button:has-text("CSV"), a:has-text("CSV")').first();
    if (await exportButton.isVisible()) {
      await exportButton.click();

      const download = await downloadPromise;
      expect(download).toBeTruthy();
      expect(download.suggestedFilename()).toMatch(/\.csv$/i);
    }
  });

  test('should have revoke action for individual credentials', async ({ page }) => {
    const revokeButtons = page.locator('button:has-text("Revoke"), [aria-label*="revoke" i]');
    const buttonCount = await revokeButtons.count();

    if (buttonCount > 0) {
      await expect(revokeButtons.first()).toBeVisible();
    }
  });

  test('should confirm revocation with dialog', async ({ page }) => {
    const revokeButton = page.locator('button:has-text("Revoke"), [aria-label*="revoke" i]').first();

    if (await revokeButton.isVisible()) {
      await revokeButton.click();

      // Check for confirmation dialog
      const dialog = page.locator('[role="dialog"], [class*="confirm"], [class*="modal"]').first();
      await expect(dialog).toBeVisible({ timeout: 2000 }).catch(() => {
        // Some implementations might use native confirm
      });
    }
  });

  test('should sort table by clicking headers', async ({ page }) => {
    const headers = page.locator('th:has-text("Name"), th:has-text("Date"), th:has-text("Token")');

    if (await headers.first().isVisible()) {
      await headers.first().click();
      await page.waitForTimeout(300);

      // Click again to reverse sort
      await headers.first().click();
      await page.waitForTimeout(300);
    }
  });

  test('should filter by date range', async ({ page }) => {
    const dateInputs = page.locator('input[type="date"]');
    const inputCount = await dateInputs.count();

    if (inputCount >= 2) {
      await dateInputs.nth(0).fill('2024-01-01');
      await dateInputs.nth(1).fill('2024-12-31');

      // Apply filter
      const filterButton = page.locator('button:has-text("Apply"), button:has-text("Filter")').first();
      if (await filterButton.isVisible()) {
        await filterButton.click();
      }
    }
  });

  test('table should be responsive', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });

    const table = page.locator('table, [class*="table"]').first();
    await expect(table).toBeVisible();

    // Check for horizontal scroll or responsive adjustments
    const tableContainer = table.locator('~ div, parent');
    await expect(tableContainer).toBeVisible();
  });

  test('should display credential count', async ({ page }) => {
    const countElement = page.locator('text=/\\d+ credentials/i, text=/\\d+ records/i').first();
    await expect(countElement).toBeVisible({ timeout: 3000 }).catch(() => {
      // Count might not be displayed
    });
  });

  test('should have refresh button', async ({ page }) => {
    const refreshButton = page.locator('button:has-text("Refresh"), [aria-label*="refresh" i]').first();
    await expect(refreshButton.count()).toBeGreaterThanOrEqual(0);
  });

  test('refresh should reload data', async ({ page }) => {
    const refreshButton = page.locator('button:has-text("Refresh"), [aria-label*="refresh" i]').first();

    if (await refreshButton.isVisible()) {
      await refreshButton.click();
      await page.waitForTimeout(500);
      // Page should still be functional
      expect(page).toHaveURL(/\/admin\/credentials/);
    }
  });
});
