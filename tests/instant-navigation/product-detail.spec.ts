import { expect, test } from '@playwright/test';
import { instant } from '@next/playwright';

const productPath =
  '/products/%D8%AA%D8%B4%D9%88%DB%8C%D9%82%DB%8C-%D8%A2%D9%85%D9%88%D8%B2%D8%B4%DB%8C-%D8%B3%DA%AF-%D8%A8%D8%A7-%D8%B7%D8%B9%D9%85-%DA%AF%D9%88%D8%B4%D8%AA-%D8%B3%DA%AF-%D8%AA%D8%B4%D9%88%DB%8C%D9%82%DB%8C-%D9%88-%D8%A7%D8%B3%D9%86%DA%A9-%D8%AA%D8%B4%D9%88%DB%8C%D9%82%DB%8C-%D8%A2%D9%85%D9%88%D8%B2%D8%B4%DB%8C';
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
