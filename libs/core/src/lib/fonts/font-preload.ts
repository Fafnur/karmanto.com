import { DOCUMENT } from '@angular/common';
import { EnvironmentProviders, inject, LOCALE_ID, makeEnvironmentProviders, provideEnvironmentInitializer } from '@angular/core';

import { getLocale, LocaleId } from '../locales/locales';

// Noto Sans of the first screen in the locale's script. Latin on Russian pages (brand, «iOS») still loads through CSS —
// preloading it too slows the heading down on a slow connection.
const FONTS: Record<LocaleId, string[]> = {
  en: ['noto-sans-latin-wght-normal'],
  es: ['noto-sans-latin-wght-normal'],
  ru: ['noto-sans-cyrillic-wght-normal'],
};

/**
 * Server only (`app.config.server.ts`): preloads the fonts of the page's locale in the prerendered HTML.
 * `index.html` is shared by all locales and cannot know them; CSS discovers fonts too late for the heading (LCP).
 */
export function provideFontPreload(): EnvironmentProviders {
  return makeEnvironmentProviders([
    provideEnvironmentInitializer(() => {
      const document = inject(DOCUMENT);
      for (const font of FONTS[getLocale(inject(LOCALE_ID)).id]) {
        const link = document.createElement('link');
        // Attributes, not properties: the server DOM does not serialize `link.as`.
        link.setAttribute('rel', 'preload');
        link.setAttribute('as', 'font');
        link.setAttribute('type', 'font/woff2');
        link.setAttribute('href', `/fonts/${font}.woff2`);
        link.setAttribute('crossorigin', '');
        document.head.appendChild(link);
      }
    }),
  ]);
}
