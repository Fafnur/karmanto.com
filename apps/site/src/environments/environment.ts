import { AnalyticsConfig } from '@karmanto/analytics';

/** Development and tests: no counters, so no cookie banner. Production values — `environment.production.ts`. */
export const environment: { readonly analytics: AnalyticsConfig } = {
  analytics: {
    googleAnalyticsId: '',
    yandexMetrikaId: 0,
  },
};
