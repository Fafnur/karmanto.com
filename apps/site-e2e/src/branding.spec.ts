import { expect, test } from './fixtures';

test('icons and the manifest from <head> are served', async ({ page, request }) => {
  await page.emulateMedia({ colorScheme: 'light' });
  await page.goto('/');

  const hrefs = await page
    .locator('link[rel="icon"], link[rel="apple-touch-icon"], link[rel="manifest"]')
    .evaluateAll((links) => links.map((link) => (link as HTMLLinkElement).href));
  expect(hrefs).toHaveLength(4);

  for (const href of hrefs) {
    expect((await request.get(href)).status(), href).toBe(200);
  }

  const manifest = await (await request.get('/site.webmanifest')).json();
  for (const icon of manifest.icons) {
    expect((await request.get(icon.src)).status(), icon.src).toBe(200);
  }

  await expect(page.locator('meta[name="theme-color"]')).toHaveAttribute('content', '#F3ECE0');
});

const locales = [
  { url: '/', file: 'noto-sans-latin-wght-normal.woff2' },
  { url: '/ru/', file: 'noto-sans-cyrillic-wght-normal.woff2' },
];

for (const { url, file } of locales) {
  test(`${url} uses the site font and colours`, async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'light' });
    const font = page.waitForResponse((response) => response.url().endsWith(`/fonts/${file}`));
    await page.goto(url);

    expect((await font).status()).toBe(200);
    await expect(page.locator(`link[rel="preload"][href="/fonts/${file}"]`)).toHaveCount(1);

    const body = await page.evaluate(() => {
      const style = getComputedStyle(document.body);
      return { family: style.fontFamily, color: style.color, background: getComputedStyle(document.documentElement).backgroundColor };
    });
    expect(body.family).toContain('Noto Sans');
    expect(body.color).toBe('rgb(43, 38, 31)');
    expect(body.background).toBe('rgb(243, 236, 224)');
  });
}

test('names of other scripts use the subsets of the site font', async ({ page }) => {
  await page.goto('/');
  const loaded = await page.evaluate(async () => {
    await Promise.all(['Čeština', 'Ελληνικά', 'Tiếng Việt'].map((text) => document.fonts.load('16px "Noto Sans"', text)));
    return [...document.fonts].filter((face) => face.family.includes('Noto Sans') && face.status === 'loaded').length;
  });

  // latin + latin-ext + greek + vietnamese
  expect(loaded).toBeGreaterThanOrEqual(4);
});

test('prerendered pages are hydrated, not rendered again', async ({ page }) => {
  const errors: string[] = [];
  page.on('console', (message) => message.type() === 'error' && errors.push(message.text()));

  await page.goto('/ru/privacy/');
  const state = await page.locator('script#ng-state').textContent();

  expect(JSON.parse(state ?? '{}').__nghData__?.length).toBeGreaterThan(0);
  expect(errors).toEqual([]);
});
