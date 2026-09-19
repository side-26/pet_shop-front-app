import { expect, test } from '@playwright/test';
import { instant } from '@next/playwright';

const productPath = '/products/product-0de16436';
const shell = '[data-product-detail-shell]';
const content = '[data-product-detail-content]';

test('serves the responsive product shell instantly on initial load', async ({ page }) => {
  await instant(
    page,
    async () => {
      await page.goto(productPath);
      await expect(page.locator(shell)).toBeVisible();
    },
    { baseURL: 'http://127.0.0.1:3101' },
  );
});

test('commits the prefetched product shell immediately after a product-link click', async ({
  page,
}) => {
  await page.goto('/products/list');
  const productLink = page.locator(`a[href="${productPath}"]`).first();
  await expect(productLink).toBeVisible({ timeout: 20_000 });

  await instant(page, async () => {
    await productLink.click();
    await expect(page.locator(shell)).toBeVisible();
    await expect(page.locator(content)).toHaveCount(0);
  });
  await expect(page.locator(content)).toBeVisible();
});
