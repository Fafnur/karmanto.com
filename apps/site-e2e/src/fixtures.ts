import { expect, Page } from '@playwright/test';

export type { Page, Route } from '@playwright/test';
export { expect, test } from '@playwright/test';

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
