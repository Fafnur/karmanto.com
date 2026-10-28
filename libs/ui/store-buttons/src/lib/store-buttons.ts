import { Component, inject, LOCALE_ID } from '@angular/core';

import { AnalyticsService } from '@karmanto/analytics';
import { getLocale, SITE, StoreId } from '@karmanto/core';

interface Store {
  readonly id: StoreId;
  readonly url: string | null;
  readonly name: string;
  readonly soon: string;
}

/**
 * App Store and Google Play: official badges (`public/badges/{store}-{locale}.svg`) once the store link is in `SITE.stores`,
 * «Coming soon» pills until then. No Apple/Google logos outside official badges.
 */
@Component({
  selector: 'km-store-buttons',
  templateUrl: './store-buttons.html',
  host: { class: 'flex flex-col gap-3 sm:flex-row' },
})
export class StoreButtons {
  private readonly analytics = inject(AnalyticsService);
  protected readonly locale = getLocale(inject(LOCALE_ID));

  protected readonly stores: Store[] = [
    {
      id: 'appStore',
      url: SITE.stores.appStore,
      name: 'App Store',
      soon: $localize`:Store buttons|Placeholder until the app is in the App Store:Coming soon to the App Store`,
    },
    {
      id: 'googlePlay',
      url: SITE.stores.googlePlay,
      name: 'Google Play',
      soon: $localize`:Store buttons|Placeholder until the app is in Google Play:Coming soon to Google Play`,
    },
  ];

  onStoreClick(store: StoreId): void {
    this.analytics.event('store_click', { platform: store === 'appStore' ? 'ios' : 'android' });
  }
}
