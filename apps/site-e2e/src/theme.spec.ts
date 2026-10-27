import { AxeBuilder } from '@axe-core/playwright';

import { expect, test, waitForHydration } from './fixtures';

const LIGHT = 'rgb(243, 236, 224)';
const DARK = 'rgb(27, 24, 20)';

test.describe('theme', () => {
  test('follows the color scheme of the device by default', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/');
    await expect(page.locator('html')).not.toHaveClass(/theme-/);
    await expect(page.locator('html')).toHaveCSS('background-color', LIGHT);

    await page.emulateMedia({ colorScheme: 'dark' });
    await expect(page.locator('html')).toHaveCSS('background-color', DARK);
  });

  test('the choice applies at once and before the first paint after a reload', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/');
    await waitForHydration(page);

    await page.getByRole('banner').getByRole('button', { name: 'Choose theme' }).click();
    await page.getByRole('menuitemradio', { name: 'Dark' }).click();
    await expect(page.locator('html')).toHaveClass(/theme-dark/);
    await expect(page.locator('html')).toHaveCSS('background-color', DARK);

    await page.goto('/ru/support/');
    // Before hydration: set by the script in `index.html`.
    await expect(page.locator('html')).toHaveClass(/theme-dark/);
    await expect(page.locator('meta[name="theme-color"]')).toHaveAttribute('content', '#1B1814');
  });

  test('light overrides a dark device', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.addInitScript(() => localStorage.setItem('karmanto.theme', 'light'));
    await page.goto('/');

    await expect(page.locator('html')).toHaveCSS('background-color', LIGHT);
    await expect(page.locator('meta[name="theme-color"]')).toHaveAttribute('content', '#F3ECE0');
  });

  // Contrast of text and background pairs (WCAG AA) in both themes; the full axe run is task 7.
  for (const theme of ['light', 'dark']) {
    for (const url of ['/', '/privacy/', '/ru/support/', '/404/']) {
      test(`${url} in the ${theme} theme has no serious or critical axe violations`, async ({ page }) => {
        await page.addInitScript((mode) => localStorage.setItem('karmanto.theme', mode), theme);
        await page.goto(url);
        await page.getByRole('contentinfo').waitFor();

        const { violations } = await new AxeBuilder({ page })
          .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'best-practice'])
          .analyze();
        const blocking = violations
          .filter((violation) => violation.impact === 'serious' || violation.impact === 'critical')
          .map((violation) => `${violation.id} (${violation.impact}): ${violation.nodes.map((node) => node.target.join(' ')).join(', ')}`);

        expect(blocking).toEqual([]);
      });
    }
  }
});
