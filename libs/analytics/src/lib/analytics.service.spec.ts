import { DOCUMENT } from '@angular/common';
import { TestBed } from '@angular/core/testing';

import { ANALYTICS_CONFIG } from './analytics.config';
import { AnalyticsService } from './analytics.service';

interface TestWindow extends Window {
  dataLayer?: IArguments[];
  ym?: { a?: unknown[][] };
}

describe('AnalyticsService', () => {
  let service: AnalyticsService;
  let document: Document;
  let window: TestWindow;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: ANALYTICS_CONFIG, useValue: { googleAnalyticsId: 'G-TEST', yandexMetrikaId: 123 } }],
    });
    service = TestBed.inject(AnalyticsService);
    document = TestBed.inject(DOCUMENT);
    window = document.defaultView as TestWindow;
    delete window.dataLayer;
    delete window.ym;
    document.head.querySelectorAll('script').forEach((script) => script.remove());
  });

  const scripts = () => Array.from(document.head.querySelectorAll('script'), (script) => script.src);
  const gtagCalls = () => (window.dataLayer ?? []).map((args) => Array.from(args));

  it('loads nothing and sends nothing before start', () => {
    service.pageView('/privacy/', 'Privacy');
    service.event('store_click');

    expect(scripts()).toEqual([]);
    expect(window.dataLayer).toBeUndefined();
  });

  it('loads both counters once, with own page tracking and Web Visor off', () => {
    service.start();
    service.start();

    expect(scripts()).toEqual(['https://www.googletagmanager.com/gtag/js?id=G-TEST', 'https://mc.yandex.ru/metrika/tag.js']);
    expect(gtagCalls()).toContainEqual(['config', 'G-TEST', { send_page_view: false }]);
    expect(window.ym?.a?.[0]).toEqual([
      123,
      'init',
      expect.objectContaining({ webvisor: false, clickmap: true, trackLinks: true, accurateTrackBounce: true }),
    ]);
  });

  it('sends page views and events to both counters', () => {
    service.start();
    service.pageView('/ru/privacy/', 'Политика');
    service.event('store_click', { platform: 'ios' });

    expect(gtagCalls()).toContainEqual(['event', 'page_view', expect.objectContaining({ page_title: 'Политика' })]);
    expect(gtagCalls()).toContainEqual(['event', 'store_click', { platform: 'ios' }]);
    expect(window.ym?.a).toContainEqual([123, 'hit', expect.stringContaining('/ru/privacy/'), { title: 'Политика' }]);
    expect(window.ym?.a).toContainEqual([123, 'reachGoal', 'store_click', { platform: 'ios' }]);
  });

  it('removes the counters cookies', () => {
    document.cookie = '_ga=1; path=/';
    document.cookie = '_ym_uid=1; path=/';
    document.cookie = 'other=1; path=/';

    service.clearCookies();

    expect(document.cookie).not.toContain('_ga=');
    expect(document.cookie).not.toContain('_ym_uid=');
    expect(document.cookie).toContain('other=1');
  });
});
