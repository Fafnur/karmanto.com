export interface Language {
  readonly code: string;
  /** The language named in itself, the same on every page. */
  readonly name: string;
  readonly dir?: 'rtl';
}

/**
 * Languages a user can learn: `learnLanguageCodes` and `languageEndonyms` of `lib/core/l10n/languages.dart` in the app.
 * Words are translated to 59 languages (`nativeLanguageCodes` there).
 */
export const LEARN_LANGUAGES: Language[] = (
  [
    { code: 'ar', name: 'العربية', dir: 'rtl' },
    { code: 'bg', name: 'Български' },
    { code: 'ca', name: 'Català' },
    { code: 'cs', name: 'Čeština' },
    { code: 'da', name: 'Dansk' },
    { code: 'de', name: 'Deutsch' },
    { code: 'el', name: 'Ελληνικά' },
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Español' },
    { code: 'fi', name: 'Suomi' },
    { code: 'fr', name: 'Français' },
    { code: 'he', name: 'עברית', dir: 'rtl' },
    { code: 'hi', name: 'हिन्दी' },
    { code: 'hr', name: 'Hrvatski' },
    { code: 'hu', name: 'Magyar' },
    { code: 'id', name: 'Bahasa Indonesia' },
    { code: 'it', name: 'Italiano' },
    { code: 'ja', name: '日本語' },
    { code: 'ko', name: '한국어' },
    { code: 'ms', name: 'Bahasa Melayu' },
    { code: 'nl', name: 'Nederlands' },
    { code: 'no', name: 'Norsk' },
    { code: 'pl', name: 'Polski' },
    { code: 'pt', name: 'Português' },
    { code: 'ro', name: 'Română' },
    { code: 'ru', name: 'Русский' },
    { code: 'sk', name: 'Slovenčina' },
    { code: 'sv', name: 'Svenska' },
    { code: 'th', name: 'ไทย' },
    { code: 'tr', name: 'Türkçe' },
    { code: 'uk', name: 'Українська' },
    { code: 'vi', name: 'Tiếng Việt' },
    { code: 'zh', name: '中文' },
  ] satisfies Language[]
).sort((a, b) => a.name.localeCompare(b.name, 'en'));
