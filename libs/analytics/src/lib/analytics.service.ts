import { DOCUMENT } from '@angular/common';
import { inject, Service } from '@angular/core';

import { ANALYTICS_CONFIG } from './analytics.config';

type Params = Record<string, string | number | boolean>;

interface AnalyticsWindow extends Window {
  dataLayer?: unknown[];
  gtag?: (...args: unknown[]) => void;
  ym?: ((...args: unknown[]) => void) & { a?: unknown[]; l?: number };
}

/**
 * The only analytics entry point: components call `pageView` and `event` and never know which counters exist.
 * Counters are loaded by `start()` after consent; before that every call is a no-op.
 */
@Service()
export class AnalyticsService {
  private readonly config = inject(ANALYTICS_CONFIG);
  private readonly document = inject(DOCUMENT);
  private started = false;

  get window(): AnalyticsWindow {
    return this.document.defaultView as AnalyticsWindow;
  }

  start(): void {
    if (this.started) {
      return;
    }
    this.started = true;

    const { googleAnalyticsId, yandexMetrikaId } = this.config;
    if (googleAnalyticsId) {
      this.window.dataLayer = this.window.dataLayer ?? [];
      const dataLayer = this.window.dataLayer;
      // gtag.js expects the `arguments` object itself.
      this.window.gtag = function gtag() {
        // eslint-disable-next-line prefer-rest-params
        dataLayer.push(arguments);
      };
      this.window.gtag('js', new Date());
      // Page views are sent by the router (`pageView`), not by gtag on load.
      this.window.gtag('config', googleAnalyticsId, { send_page_view: false });
      this.loadScript(`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(googleAnalyticsId)}`);
    }

    if (yandexMetrikaId) {
      // The official snippet: calls are queued in `ym.a` until tag.js loads and replays them.
      if (!this.window.ym) {
        const queue: unknown[] = [];
        this.window.ym = Object.assign((...args: unknown[]) => queue.push(args), { a: queue, l: Date.now() });
      }
      const ym = this.window.ym;
      this.loadScript('https://mc.yandex.ru/metrika/tag.js');
      ym(yandexMetrikaId, 'init', { defer: true, webvisor: false, clickmap: true, trackLinks: true, accurateTrackBounce: true });
    }
  }

  pageView(url: string, title: string): void {
    if (!this.started) {
      return;
    }
    const location = new URL(url, this.document.baseURI).href;
    this.window.gtag?.('event', 'page_view', { page_location: location, page_title: title });
    if (this.config.yandexMetrikaId) {
      this.window.ym?.(this.config.yandexMetrikaId, 'hit', location, { title });
    }
  }

  event(name: string, params: Params = {}): void {
    if (!this.started) {
      return;
    }
    this.window.gtag?.('event', name, params);
    if (this.config.yandexMetrikaId) {
      this.window.ym?.(this.config.yandexMetrikaId, 'reachGoal', name, params);
    }
  }

  /** Withdrawn consent: removes the counters' cookies; the caller reloads the page to unload the scripts. */
  clearCookies(): void {
    const hostname = this.document.location.hostname;
    for (const cookie of this.document.cookie.split(';')) {
      const name = cookie.split('=')[0].trim();
      if (/^(_ga|_gid|_gat|_ym_)/.test(name)) {
        for (const domain of ['', `; domain=${hostname}`, `; domain=.${hostname}`]) {
          this.document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/${domain}`;
        }
      }
    }
  }

  private loadScript(src: string): void {
    const script = this.document.createElement('script');
    script.async = true;
    script.src = src;
    this.document.head.appendChild(script);
  }
}
