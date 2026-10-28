import { expect, test, waitForHydration } from './fixtures';

test.describe('home page', () => {
  test('has the sections the navigation links to', async ({ page }) => {
    await page.goto('/');

    await expect(page.locator('h1')).toHaveText('Words that are always with you');
    await expect(page.locator('#how')).toBeAttached();
    await expect(page.locator('#features')).toBeAttached();
    await expect(page.locator('article km-mode-preview')).toHaveCount(3);
  });

  test('lists the languages to learn, each named in itself', async ({ page }) => {
    await page.goto('/ru/');
    const languages = page.locator('[aria-labelledby="languages-heading"] li');

    await expect(languages).toHaveCount(33);
    await expect(languages.filter({ hasText: 'Ελληνικά' })).toHaveAttribute('lang', 'el');
    await expect(languages.filter({ hasText: 'العربية' })).toHaveAttribute('dir', 'rtl');
  });

  test('the card flips and the answer buttons show the next word', async ({ page }) => {
    await page.goto('/ru/');
    await waitForHydration(page);
    const demo = page.locator('km-study-card');
    const card = demo.getByRole('button', { name: /pocket/ });

    await expect(card).toContainText('Нажмите, чтобы перевернуть');
    await card.click();
    await expect(demo.getByRole('button', { name: /карман/ })).toBeVisible();

    await demo.getByRole('button', { name: 'Знаю', exact: true }).click();
    await expect(demo.getByRole('button', { name: /remember/ })).toContainText('Нажмите, чтобы перевернуть');
    await expect(demo).toContainText('2 / 4');

    await demo.getByRole('button', { name: /remember/ }).press('Enter');
    await expect(demo.getByRole('button', { name: /помнить/ })).toBeVisible();
  });

  test('shows «coming soon» instead of store badges while there are no store links', async ({ page }) => {
    await page.goto('/ru/');

    await expect(page.getByText('Скоро в App Store')).toHaveCount(2);
    await expect(page.getByText('Скоро в Google Play')).toHaveCount(2);
    await expect(page.locator('img[src^="/badges/"]')).toHaveCount(0);
  });

  test('hides the screenshot gallery until screenshots exist', async ({ page }) => {
    await page.goto('/');

    await expect(page.locator('img[src^="/screenshots/"]')).toHaveCount(0);
  });

  test('links the import section to the support answer about Google Sheets', async ({ page }) => {
    await page.goto('/es/');

    await expect(page.getByRole('link', { name: 'Cómo conectar una hoja de Google Sheets' })).toHaveAttribute(
      'href',
      '/es/support/#google-sheet',
    );
  });

  test('header link to a section scrolls there from another page', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/es/support/');
    await page.getByRole('banner').locator('a[href="/es/#features"]').filter({ visible: true }).first().click();

    await expect(page).toHaveURL('/es/#features');
    await expect(page.locator('#features')).toBeInViewport();
  });
});
