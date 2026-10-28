import { computed, inject, Service, signal } from '@angular/core';

import { LocalStorage } from '@karmanto/core';

import { ANALYTICS_CONFIG } from './analytics.config';

/** Bump to ask everyone again (e.g. a new counter or a new purpose). */
export const CONSENT_VERSION = 1;
export const CONSENT_STORAGE_KEY = 'karmanto.consent';

interface StoredConsent {
  readonly v: number;
  readonly analytics: boolean;
  readonly at: string;
}

/**
 * The visitor's choice about analytics cookies, kept in `LocalStorage` (in memory, until the page is closed, where the
 * browser storage is unavailable). Browser only: on the server nothing is read and the banner is never rendered.
 */
@Service()
export class ConsentService {
  private readonly config = inject(ANALYTICS_CONFIG);
  private readonly storage = inject(LocalStorage);

  /** At least one counter is configured: otherwise there is nothing to ask consent for. */
  readonly enabled = !!this.config.googleAnalyticsId || !!this.config.yandexMetrikaId;

  /** `null` — no choice yet (or an outdated version). */
  readonly $analytics = signal<boolean | null>(null);
  private readonly $reopened = signal(false);
  private readonly $restored = signal(false);

  /** Shown once restored in the browser, while there is no choice, or when reopened from the footer. */
  readonly $bannerOpen = computed(() => this.enabled && this.$restored() && (this.$analytics() === null || this.$reopened()));

  /** Reads the stored choice. Called once in the browser. */
  restore(): void {
    this.$analytics.set(this.read()?.analytics ?? null);
    this.$restored.set(true);
  }

  open(): void {
    this.$reopened.set(true);
  }

  choose(analytics: boolean): void {
    this.storage.setItem(CONSENT_STORAGE_KEY, JSON.stringify({ v: CONSENT_VERSION, analytics, at: new Date().toISOString() }));
    this.$analytics.set(analytics);
    this.$reopened.set(false);
  }

  private read(): StoredConsent | null {
    try {
      const value = JSON.parse(this.storage.getItem(CONSENT_STORAGE_KEY) ?? 'null') as StoredConsent | null;
      return value?.v === CONSENT_VERSION && typeof value.analytics === 'boolean' ? value : null;
    } catch {
      // Not JSON: written by someone else or corrupted.
      return null;
    }
  }
}
