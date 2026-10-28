import { AnalyticsConfig } from '@karmanto/analytics';

/** Replaces `environment.ts` in the production build only (`fileReplacements`). Web Visor is never enabled. */
export const environment: { readonly analytics: AnalyticsConfig } = {
  analytics: {
    googleAnalyticsId: 'G-PEPSB4K6JT',
    yandexMetrikaId: 113843921,
  },
};
