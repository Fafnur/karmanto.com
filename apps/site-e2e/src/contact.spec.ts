import { expect, Page, Route, test } from './fixtures';

const FUNCTION = '**/functions/v1/contact';

async function fillValid(page: Page): Promise<void> {
  await page.locator('#contact-name').fill('Alex');
  await page.locator('#contact-email').fill('alex@example.com');
  await page.locator('#contact-telegram').fill('@alex_92');
  await page.locator('#contact-message').fill('Hello, this is a test message.');
  await page.locator('#contact-consent').check();
}

/** The function treats submissions faster than 3 s as bots: wait like a person would. */
async function waitLikeAPerson(page: Page): Promise<void> {
  await page.clock.fastForward(4000);
}

test.beforeEach(async ({ page }) => {
  await page.clock.install();
});

test('shows errors under the fields and focuses the first one', async ({ page }) => {
  await page.goto('/contact/');
  await page.getByRole('button', { name: 'Send' }).click();

  await expect(page.locator('#contact-name')).toBeFocused();
  await expect(page.locator('#contact-name')).toHaveAttribute('aria-invalid', 'true');
  await expect(page.locator('#contact-name-error')).toHaveText('Enter your name');
  await expect(page.locator('#contact-consent-error')).not.toBeEmpty();

  await page.locator('#contact-telegram').fill('@ab');
  await page.locator('#contact-message').fill('short');
  await page.locator('#contact-message').blur();
  await expect(page.locator('#contact-telegram-error')).not.toBeEmpty();
  await expect(page.locator('#contact-message-error')).toHaveText('At least 10 characters');
});

test('prefills the topic from the address', async ({ page }) => {
  await page.goto('/ru/contact/?topic=account_deletion');

  await expect(page.locator('#contact-topic')).toHaveValue('account_deletion');
});

test('sends the message and thanks the sender', async ({ page }) => {
  let body: Record<string, unknown> = {};
  await page.route(FUNCTION, async (route: Route) => {
    body = route.request().postDataJSON();
    await route.fulfill({ status: 200, json: { ok: true } });
  });

  await page.goto('/es/contact/');
  await fillValid(page);
  await waitLikeAPerson(page);
  await page.getByRole('button', { name: 'Enviar' }).click();

  await expect(page.getByRole('status')).toContainText('alex@example.com');
  expect(body).toMatchObject({
    name: 'Alex',
    email: 'alex@example.com',
    telegram: '@alex_92',
    topic: 'question',
    locale: 'es',
    website: '',
  });
  expect(body['elapsedMs']).toBeGreaterThanOrEqual(3000);

  await page.getByRole('button', { name: 'Enviar otro mensaje' }).click();
  await expect(page.locator('#contact-name')).toHaveValue('');
});

test('explains the rate limit', async ({ page }) => {
  await page.route(FUNCTION, (route) => route.fulfill({ status: 429, json: { error: 'rate_limited' } }));

  await page.goto('/contact/');
  await fillValid(page);
  await waitLikeAPerson(page);
  await page.getByRole('button', { name: 'Send' }).click();

  await expect(page.getByRole('alert')).toHaveText('Too many messages. Please try again later.');
});

test('offers the email when sending fails', async ({ page }) => {
  await page.route(FUNCTION, (route) => route.abort('failed'));

  await page.goto('/ru/contact/');
  await fillValid(page);
  await waitLikeAPerson(page);
  await page.getByRole('button', { name: 'Отправить' }).click();

  await expect(page.getByRole('alert')).toContainText('Сообщение не отправилось');
  await expect(page.getByRole('alert').locator('a[href="mailto:support@karmanto.com"]')).toBeVisible();
});

test('keeps the honeypot away from people and screen readers', async ({ page }) => {
  await page.goto('/contact/');

  await expect(page.locator('#contact-website')).toHaveAttribute('tabindex', '-1');
  await expect(page.getByRole('textbox', { name: 'Website' })).toHaveCount(0);
});
