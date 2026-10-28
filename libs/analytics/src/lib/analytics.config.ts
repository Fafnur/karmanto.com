import { InjectionToken } from '@angular/core';

export interface AnalyticsConfig {
  /** GA4 measurement ID (`G-…`); empty — off. */
  readonly googleAnalyticsId: string;
  /** Yandex Metrica counter; 0 — off. */
  readonly yandexMetrikaId: number;
}

/** Set by `provideAnalytics(config)`; by default both counters are off. */
export const ANALYTICS_CONFIG = new InjectionToken<AnalyticsConfig>('ANALYTICS_CONFIG', {
  providedIn: 'root',
  factory: () => ({ googleAnalyticsId: '', yandexMetrikaId: 0 }),
});
