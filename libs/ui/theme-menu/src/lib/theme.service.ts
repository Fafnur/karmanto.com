import { DOCUMENT } from '@angular/common';
import { inject, Service, signal } from '@angular/core';

import { LocalStorage } from '@karmanto/core';

export type ThemeMode = 'system' | 'light' | 'dark';

/** Also read by the script in `apps/site/src/index.html`, which applies the theme before the first paint. */
export const THEME_STORAGE_KEY = 'karmanto.theme';

const MODES: ThemeMode[] = ['system', 'light', 'dark'];

/** `theme-color` of the browser UI: the `background` of each theme (`styles.scss`). */
export const THEME_COLORS = { light: '#F3ECE0', dark: '#1B1814' } as const;

/**
 * The site theme: the system one by default (as in the app), light or dark by choice. The theme is a class on `<html>`
 * (`theme-light`, `theme-dark`, none for the system one) that switches the color variables in `styles.scss`.
 */
@Service()
export class ThemeService {
  private readonly storage = inject(LocalStorage);
  private readonly document = inject(DOCUMENT);

  readonly $mode = signal<ThemeMode>(this.read());

  set(mode: ThemeMode): void {
    this.storage.setItem(THEME_STORAGE_KEY, mode);
    this.$mode.set(mode);

    const root = this.document.documentElement;
    root.classList.remove('theme-light', 'theme-dark');
    if (mode !== 'system') {
      root.classList.add(`theme-${mode}`);
    }

    const dark =
      mode === 'dark' || (mode === 'system' && !!this.document.defaultView?.matchMedia?.('(prefers-color-scheme: dark)').matches);
    this.document.querySelector('meta[name="theme-color"]')?.setAttribute('content', dark ? THEME_COLORS.dark : THEME_COLORS.light);
    this.document.querySelector('meta[name="color-scheme"]')?.setAttribute('content', mode === 'system' ? 'light dark' : mode);
  }

  private read(): ThemeMode {
    const mode = this.storage.getItem(THEME_STORAGE_KEY) as ThemeMode | null;
    return mode && MODES.includes(mode) ? mode : 'system';
  }
}
