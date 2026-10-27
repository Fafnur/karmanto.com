import { addTrailingSlash } from '../navigation/trailing-slash';

export type LocaleId = 'en' | 'ru' | 'es';

export interface Locale {
  readonly id: LocaleId;
  /** Base href of the locale build. */
  readonly base: string;
  /** Code on the language button. */
  readonly code: string;
  /** Language name in the language itself. */
  readonly label: string;
  readonly flag: string;
  /** `og:locale`. */
  readonly region: string;
  /** Language hint, written in this language: shown to visitors whose browser language is this one. */
  readonly hint: string;
  readonly hintClose: string;
}

export const LOCALES: Locale[] = [
  {
    id: 'en',
    base: '/',
    code: 'EN',
    label: 'English',
    flag: '/flags/us.svg',
    region: 'en_US',
    hint: 'This page is available in English',
    hintClose: 'Close',
  },
  {
    id: 'ru',
    base: '/ru/',
    code: 'RU',
    label: 'Русский',
    flag: '/flags/ru.svg',
    region: 'ru_RU',
    hint: 'Эта страница есть на русском',
    hintClose: 'Закрыть',
  },
  {
    id: 'es',
    base: '/es/',
    code: 'ES',
    label: 'Español',
    flag: '/flags/es.svg',
    region: 'es_ES',
    hint: 'Esta página está disponible en español',
    hintClose: 'Cerrar',
  },
];

export function getLocale(id: string): Locale {
  return LOCALES.find((locale) => locale.id === id) ?? LOCALES[0];
}

/**
 * The same page in another locale build: `localeUrl(ru, '/privacy/')` → `/ru/privacy/`.
 * `url` is a router URL (relative to the base href).
 */
export function localeUrl(locale: Locale, url: string): string {
  return addTrailingSlash(locale.base + url.replace(/^\//, '').replace(/[?#].*$/, ''));
}

/**
 * The first browser language that has its own locale build, other than the current one.
 */
export function findPreferredLocale(languages: readonly string[], current: LocaleId): Locale | null {
  for (const language of languages) {
    const locale = LOCALES.find((item) => item.id === language.toLowerCase().split('-')[0]);
    if (locale) {
      return locale.id === current ? null : locale;
    }
  }

  return null;
}
