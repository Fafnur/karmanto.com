import { expect, Page, test as base } from '@playwright/test';

export type { Page, Route } from '@playwright/test';
export { expect } from '@playwright/test';

export const COUNTERS = /googletagmanager\.com|google-analytics\.com|mc\.yandex\.(ru|com)/;

/**
 * The production build has real counter IDs. Their requests are always aborted: tests never send hits.
 * `consent` — the choice stored before the page loads: `false` by default, so the cookie banner does not cover the page;
 * `null` — no choice, the banner is shown (`test.use({ consent: null })`).
 */
export const test = base.extend<{ consent: boolean | null }>({
  consent: [false, { option: true }],
  page: async ({ page, consent }, use) => {
    await page.route(COUNTERS, (route) => route.abort());
    if (consent !== null) {
      await page.addInitScript(
        (analytics) => localStorage.setItem('karmanto.consent', JSON.stringify({ v: 1, analytics, at: new Date().toISOString() })),
        consent,
      );
    }
    await use(page);
  },
});

/**
 * The language menu opens only after hydration: browser-only parts (like the language hint) have rendered by then.
 */
export async function waitForHydration(page: Page): Promise<void> {
  await page
    .getByRole('banner')
    .getByRole('button', { name: /language|язык|idioma/i })
    .click();
  await expect(page.getByRole('menu')).toBeVisible();
  await page.keyboard.press('Escape');
}
