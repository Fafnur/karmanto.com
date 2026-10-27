import { expect, test } from './fixtures';

const documents = ['privacy', 'terms', 'consent'];
const locales = ['', 'ru/', 'es/'];

for (const locale of locales) {
  for (const document of documents) {
    const url = `/${locale}${document}/`;

    test(`${url} renders the document`, async ({ page }) => {
      await page.goto(url);

      const heading = (await page.locator('h1').textContent())?.trim();
      expect(heading).toBeTruthy();
      await expect(page).toHaveTitle(`${heading} — Karmanto`);
      await expect(page.locator('time[datetime]')).toHaveAttribute('datetime', /^\d{4}-\d{2}-\d{2}$/);

      const sections = page.locator('.prose h2[id]');
      const count = await sections.count();
      expect(count).toBeGreaterThan(0);
      // Two copies of the table of contents: collapsed for handset/tablet, sidebar for web.
      await expect(page.locator('main nav ol a[href*="#"]')).toHaveCount(count * 2);

      if (document === 'privacy') {
        await expect(page.locator('.prose table')).not.toHaveCount(0);
      }
    });
  }
}

test('section anchors are the same in every locale', async ({ page }) => {
  const ids: string[][] = [];
  for (const locale of locales) {
    await page.goto(`/${locale}privacy/`);
    ids.push(await page.locator('.prose h2[id]').evaluateAll((headings) => headings.map((heading) => heading.id)));
  }

  expect(ids[1]).toEqual(ids[0]);
  expect(ids[2]).toEqual(ids[0]);
});

test('links inside documents lead to existing pages', async ({ page, request }) => {
  const hrefs = new Set<string>();
  for (const locale of locales) {
    for (const document of documents) {
      await page.goto(`/${locale}${document}/`);
      for (const href of await page
        .locator('.prose a[href^="/"]')
        .evaluateAll((links) => links.map((link) => link.getAttribute('href') ?? ''))) {
        hrefs.add(href);
      }
    }
  }

  expect(hrefs.size).toBeGreaterThan(0);
  for (const href of hrefs) {
    expect(href, href).toMatch(/\/$/);
    expect((await request.get(href)).status(), href).toBe(200);
  }
});

test('a link inside a document navigates within the locale without a reload', async ({ page }) => {
  await page.goto('/ru/privacy/');
  await page.evaluate(() => ((window as unknown as { marker: boolean }).marker = true));

  await page.locator('.prose a[href="/ru/delete-account/"]').first().click();

  await expect(page).toHaveURL('/ru/delete-account/');
  expect(await page.evaluate(() => (window as unknown as { marker?: boolean }).marker)).toBe(true);
});

test('opening a section link scrolls below the sticky header', async ({ page }) => {
  await page.goto('/es/privacy/#how-long-we-keep-data');

  const top = await page.locator('#how-long-we-keep-data').evaluate((heading) => heading.getBoundingClientRect().top);
  expect(top).toBeGreaterThanOrEqual(64);
  expect(top).toBeLessThan(200);
});
