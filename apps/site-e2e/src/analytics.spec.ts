import { COUNTERS, expect, Page, test, waitForHydration } from './fixtures';

// No stored choice: the banner is shown. Counter requests are aborted by the fixture, but still observed here.
test.use({ consent: null });

function watchCounters(page: Page): string[] {
  const requests: string[] = [];
  page.on('request', (request) => {
    if (COUNTERS.test(request.url())) {
      requests.push(request.url());
    }
  });
  return requests;
}

async function counterCookies(page: Page): Promise<string> {
  return (await page.context().cookies())
    .map(({ name }) => name)
    .filter((name) => /^_ga|^_gid|^_ym/.test(name))
    .join(',');
}

const banner = (page: Page) => page.getByRole('region', { name: 'Cookies and analytics' });

test('before a choice the banner is shown and nothing is loaded', async ({ page }) => {
  const requests = watchCounters(page);

  await page.goto('/');
  await expect(banner(page)).toBeVisible();
  await waitForHydration(page);

  expect(requests).toEqual([]);
  expect(await counterCookies(page)).toBe('');
});

test('«Accept» loads both counters and hides the banner', async ({ page }) => {
  await page.goto('/');
  const google = page.waitForRequest(/googletagmanager\.com\/gtag\/js\?id=G-PEPSB4K6JT/);
  const yandex = page.waitForRequest(/mc\.yandex\.ru\/metrika\/tag\.js/);

  await banner(page).getByRole('button', { name: 'Accept' }).click();

  await Promise.all([google, yandex]);
  await expect(banner(page)).toHaveCount(0);
  await page.reload();
  await expect(page.getByRole('contentinfo')).toBeVisible();
  await expect(banner(page)).toHaveCount(0);
});

test('«Decline» loads nothing, also after a reload', async ({ page }) => {
  const requests = watchCounters(page);

  await page.goto('/ru/');
  await page.getByRole('region', { name: 'Cookies и аналитика' }).getByRole('button', { name: 'Отклонить' }).click();
  await page.reload();
  await waitForHydration(page);

  await expect(page.getByRole('region', { name: 'Cookies и аналитика' })).toHaveCount(0);
  expect(requests).toEqual([]);
});

test('withdrawing consent in the footer reloads the page without counters', async ({ page }) => {
  await page.goto('/');
  const loaded = page.waitForRequest(COUNTERS);
  await banner(page).getByRole('button', { name: 'Accept' }).click();
  await loaded;

  await page.getByRole('contentinfo').getByRole('button', { name: 'Cookie settings' }).click();
  const requests = watchCounters(page);
  const reloaded = page.waitForEvent('load');
  await banner(page).getByRole('button', { name: 'Decline' }).click();
  await reloaded;

  await waitForHydration(page);
  await expect(banner(page)).toHaveCount(0);
  expect(requests).toEqual([]);
  expect(await counterCookies(page)).toBe('');
});
