import { expect, test, waitForHydration } from './fixtures';

test.describe('links', () => {
  test('internal links keep the trailing slash after navigation and reload', async ({ page }) => {
    await page.goto('/ru/');

    const hrefs = await page
      .getByRole('contentinfo')
      .locator('a[href^="/"]')
      .evaluateAll((links) => links.map((link) => link.getAttribute('href')));
    expect(hrefs).toEqual(['/ru/privacy/', '/ru/terms/', '/ru/support/', '/ru/delete-account/']);

    await page.getByRole('contentinfo').getByRole('link', { name: 'Поддержка' }).click();
    await expect(page).toHaveURL('/ru/support/');
    await expect(page.locator('h1')).toHaveText('Поддержка');

    await page.reload();
    await expect(page).toHaveURL('/ru/support/');
  });

  test('navigation links point to home sections', async ({ page }) => {
    await page.goto('/support/');

    await expect(page.locator('a[href="/#features"]').first()).toBeAttached();
    await expect(page.locator('a[href="/#how"]').first()).toBeAttached();
  });
});

test.describe('language menu', () => {
  test('links to the same page in every locale', async ({ page }) => {
    await page.goto('/ru/privacy/');
    await page.getByRole('button', { name: 'Выбрать язык' }).click();

    const items = page.getByRole('menuitem');
    await expect(items).toHaveCount(3);
    expect(await items.evaluateAll((links) => links.map((link) => link.getAttribute('href')))).toEqual([
      '/privacy/',
      '/ru/privacy/',
      '/es/privacy/',
    ]);
    await expect(items.nth(1)).toHaveAttribute('aria-current', 'true');

    await items.nth(2).click();
    await expect(page).toHaveURL('/es/privacy/');
    await expect(page.locator('html')).toHaveAttribute('lang', 'es');
  });

  test('works from the keyboard and closes on Escape', async ({ page }) => {
    await page.goto('/terms/');
    const button = page.getByRole('button', { name: 'Choose language' });

    await button.focus();
    await page.keyboard.press('Enter');
    await expect(page.getByRole('menu')).toBeVisible();

    await page.keyboard.press('Escape');
    await expect(page.getByRole('menu')).toBeHidden();
    await expect(button).toBeFocused();
  });
});

test.describe('metadata', () => {
  test('page has title, description, canonical and hreflang', async ({ page }) => {
    await page.goto('/es/terms/');

    await expect(page).toHaveTitle('Términos de uso — Karmanto');
    await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', /Karmanto/);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://karmanto.com/es/terms/');
    await expect(page.locator('meta[property="og:url"]')).toHaveAttribute('content', 'https://karmanto.com/es/terms/');
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', 'https://karmanto.com/og.png');

    const alternates = await page
      .locator('link[rel="alternate"][hreflang]')
      .evaluateAll((links) => links.map((link) => `${link.getAttribute('hreflang')} ${link.getAttribute('href')}`));
    expect(alternates).toEqual([
      'en https://karmanto.com/terms/',
      'ru https://karmanto.com/ru/terms/',
      'es https://karmanto.com/es/terms/',
      'x-default https://karmanto.com/terms/',
    ]);
  });

  test('404 is not indexed', async ({ page }) => {
    await page.goto('/missing/');

    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex');
    await expect(page.locator('link[rel="canonical"]')).toHaveCount(0);
  });

  test('og.png is served', async ({ request }) => {
    expect((await request.get('/og.png')).status()).toBe(200);
  });
});

test.describe('mobile menu', () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test('opens, closes on Escape and returns focus', async ({ page }) => {
    await page.goto('/privacy/');
    const toggle = page.getByRole('button', { name: 'Menu' });

    await toggle.click();
    await expect(toggle).toHaveAttribute('aria-expanded', 'true');
    await expect(page.locator('#mobile-navigation')).toBeVisible();

    await page.keyboard.press('Escape');
    await expect(page.locator('#mobile-navigation')).toHaveCount(0);
    await expect(toggle).toBeFocused();
  });

  test('closes after navigation', async ({ page }) => {
    await page.goto('/privacy/');
    await page.getByRole('button', { name: 'Menu' }).click();
    await page.locator('#mobile-navigation').getByRole('link', { name: 'Support' }).click();

    await expect(page).toHaveURL('/support/');
    await expect(page.locator('#mobile-navigation')).toHaveCount(0);
  });
});

test.describe('language hint', () => {
  test.use({ locale: 'ru-RU' });

  test('offers the browser language and remembers closing', async ({ page }) => {
    await page.goto('/terms/');
    const hint = page.getByRole('link', { name: 'Эта страница есть на русском' });

    await expect(hint).toHaveAttribute('href', '/ru/terms/');

    await page.getByRole('button', { name: 'Закрыть' }).click();
    await expect(hint).toHaveCount(0);

    await page.reload();
    await waitForHydration(page);
    await expect(hint).toHaveCount(0);
  });

  test('is not shown on the matching locale', async ({ page }) => {
    await page.goto('/ru/terms/');
    await waitForHydration(page);

    await expect(page.getByText('Эта страница есть на русском')).toHaveCount(0);
  });
});
