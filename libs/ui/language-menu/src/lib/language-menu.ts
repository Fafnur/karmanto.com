import { CdkMenu, CdkMenuItem, CdkMenuTrigger } from '@angular/cdk/menu';
import { Component, computed, inject, LOCALE_ID } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router } from '@angular/router';
import { filter, map } from 'rxjs';

import { getLocale, LOCALES, localeUrl } from '@karmanto/core';

/**
 * Language switcher: links to the same page in another locale build (full page load).
 */
@Component({
  selector: 'km-language-menu',
  imports: [CdkMenuTrigger, CdkMenu, CdkMenuItem],
  templateUrl: './language-menu.html',
})
export class LanguageMenu {
  private readonly router = inject(Router);
  private readonly $url = toSignal(
    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      map(() => this.router.url),
    ),
    { initialValue: this.router.url },
  );

  protected readonly current = getLocale(inject(LOCALE_ID));
  protected readonly $links = computed(() =>
    LOCALES.map((locale) => ({ locale, href: localeUrl(locale, this.$url()), current: locale.id === this.current.id })),
  );
}
