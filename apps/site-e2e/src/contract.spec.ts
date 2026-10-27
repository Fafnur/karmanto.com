import { expect, test } from '@playwright/test';

/**
 * Contract with the mobile app: these URLs are opened from the app and must never break.
 * See `docs/plan.md` → «Ссылки, которые уже использует приложение».
 */
const appUrls = ['/privacy', '/terms', '/support', '/ru/privacy', '/ru/terms', '/ru/support', '/es/privacy', '/es/terms', '/es/support'];

for (const url of appUrls) {
  test(`app link ${url} opens a page`, async ({ page }) => {
    const response = await page.goto(url);

    expect(response?.status()).toBe(200);
    await expect(page.locator('h1')).toBeVisible();
  });
}

const homes = [
  { url: '/', lang: 'en' },
  { url: '/ru/', lang: 'ru' },
  { url: '/es/', lang: 'es' },
];

for (const { url, lang } of homes) {
  test(`home page ${url} is served in "${lang}"`, async ({ page }) => {
    const response = await page.goto(url);

    expect(response?.status()).toBe(200);
    await expect(page.locator('html')).toHaveAttribute('lang', lang);
    await expect(page.locator('h1')).toBeVisible();
  });
}

test('unknown URL shows the 404 page', async ({ page }) => {
  const response = await page.goto('/this-page-does-not-exist/');

  expect(response?.status()).toBe(404);
  await expect(page.locator('h1')).toHaveText('Page not found');
  await expect(page.locator('a[href="/ru/"]')).toBeVisible();
});
