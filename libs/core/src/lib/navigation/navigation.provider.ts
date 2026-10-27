import { LocationStrategy, TrailingSlashPathLocationStrategy } from '@angular/common';
import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';

/**
 * Trailing-slash URLs. Add next to `provideRouter()`.
 */
export function provideSiteNavigation(): EnvironmentProviders {
  return makeEnvironmentProviders([
    // Links and the address bar end with `/`, as nginx serves them (`/privacy` → 301 → `/privacy/`).
    { provide: LocationStrategy, useClass: TrailingSlashPathLocationStrategy },
  ]);
}
