import { LocationStrategy, TrailingSlashPathLocationStrategy, ViewportScroller } from '@angular/common';
import { EnvironmentProviders, inject, makeEnvironmentProviders, provideEnvironmentInitializer } from '@angular/core';
import { TitleStrategy } from '@angular/router';

import { SeoStrategy } from '../seo/seo.strategy';

/**
 * Trailing-slash URLs, page metadata from routes, anchor offset for the sticky header. Add next to `provideRouter()`.
 */
export function provideSiteNavigation(): EnvironmentProviders {
  return makeEnvironmentProviders([
    // Links and the address bar end with `/`, as nginx serves them (`/privacy` → 301 → `/privacy/`).
    { provide: LocationStrategy, useClass: TrailingSlashPathLocationStrategy },
    { provide: TitleStrategy, useClass: SeoStrategy },
    // Anchor scrolling stops below the sticky header (64 px) with some air.
    provideEnvironmentInitializer(() => inject(ViewportScroller).setOffset([0, 88])),
  ]);
}
