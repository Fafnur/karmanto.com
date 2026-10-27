import { DatePipe, NgTemplateOutlet } from '@angular/common';
import { Component, computed, inject, input, LOCALE_ID } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router, RouterLink } from '@angular/router';

import { getLocale, removeTrailingSlash } from '@karmanto/core';
import { LegalDocument } from '@karmanto/legal/content';

/**
 * Privacy policy, terms and consent: the document comes from the route resolver (`legalDocument()`).
 */
@Component({
  selector: 'km-legal-page',
  imports: [DatePipe, NgTemplateOutlet, RouterLink],
  templateUrl: './legal-page.html',
  host: { class: 'block' },
})
export class LegalPage {
  private readonly sanitizer = inject(DomSanitizer);
  private readonly router = inject(Router);
  private readonly locale = getLocale(inject(LOCALE_ID));

  readonly $document = input.required<LegalDocument>({ alias: 'document' });

  // Built from Markdown in the repository at build time, not user input. The sanitizer would strip the `id` of headings.
  protected readonly $html = computed(() => this.sanitizer.bypassSecurityTrustHtml(this.$document().html));

  /**
   * Links inside the document already carry the locale prefix (`/ru/privacy/`): hand them to the router like `routerLink`.
   */
  onContentClick(event: MouseEvent): void {
    const link = (event.target as Element | null)?.closest('a');
    const href = link?.getAttribute('href');
    if (!link || !href || link.target || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
      return;
    }

    if (href.startsWith(this.locale.base)) {
      event.preventDefault();
      void this.router.navigateByUrl(removeTrailingSlash(href.slice(this.locale.base.length - 1)));
    }
  }
}
