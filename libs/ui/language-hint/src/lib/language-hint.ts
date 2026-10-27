import { afterNextRender, Component, computed, inject, LOCALE_ID, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router } from '@angular/router';
import { filter, map } from 'rxjs';

import { findPreferredLocale, getLocale, Locale, localeUrl, LocalStorage } from '@karmanto/core';

const STORAGE_KEY = 'km-language-hint-closed';

/**
 * «This page is available in Russian»: shown when the browser language matches another locale of the site.
 * Browser only (not prerendered); closing is remembered.
 */
@Component({
  selector: 'km-language-hint',
  templateUrl: './language-hint.html',
})
export class LanguageHint {
  private readonly router = inject(Router);
  private readonly storage = inject(LocalStorage);
  private readonly current = getLocale(inject(LOCALE_ID));
  private readonly $url = toSignal(
    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      map(() => this.router.url),
    ),
    { initialValue: this.router.url },
  );

  protected readonly $locale = signal<Locale | null>(null);
  protected readonly $href = computed(() => {
    const locale = this.$locale();
    return locale ? localeUrl(locale, this.$url()) : null;
  });

  constructor() {
    afterNextRender(() => {
      if (this.storage.getItem(STORAGE_KEY) !== '1') {
        this.$locale.set(findPreferredLocale(navigator.languages ?? [navigator.language], this.current.id));
      }
    });
  }

  onClose(): void {
    this.$locale.set(null);
    this.storage.setItem(STORAGE_KEY, '1');
  }
}
