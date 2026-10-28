import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ConsentService } from '@karmanto/analytics';
import { PATHS, SITE } from '@karmanto/core';

/**
 * Site footer: documents, support, account deletion, cookie settings (when counters are configured), contacts.
 */
@Component({
  selector: 'km-footer',
  imports: [RouterLink],
  templateUrl: './footer.html',
  host: { role: 'contentinfo', class: 'block border-t border-outline' },
})
export class Footer {
  protected readonly site = SITE;
  protected readonly paths = PATHS;
  protected readonly year = new Date().getFullYear();
  protected readonly consent = inject(ConsentService);

  onCookieSettings(): void {
    this.consent.open();
  }
}
