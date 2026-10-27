import { findPreferredLocale, getLocale, localeUrl } from './locales';

describe('locales', () => {
  it('builds the same page in another locale', () => {
    expect(localeUrl(getLocale('ru'), '/privacy/')).toBe('/ru/privacy/');
    expect(localeUrl(getLocale('en'), '/privacy/?a=1#top')).toBe('/privacy/');
    expect(localeUrl(getLocale('es'), '/')).toBe('/es/');
    expect(localeUrl(getLocale('ru'), '/support')).toBe('/ru/support/');
  });

  it('finds the first browser language with its own build', () => {
    expect(findPreferredLocale(['de-DE', 'ru-RU', 'en'], 'en')?.id).toBe('ru');
    expect(findPreferredLocale(['en-GB', 'ru'], 'en')).toBeNull();
    expect(findPreferredLocale(['de'], 'en')).toBeNull();
  });
});
