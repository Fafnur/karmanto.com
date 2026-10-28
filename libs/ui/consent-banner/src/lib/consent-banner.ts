import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { AnalyticsService, ConsentService } from '@karmanto/analytics';
import { PATHS } from '@karmanto/core';
import { Button } from '@karmanto/ui/buttons';

/**
 * Cookie consent at the bottom of the screen: «Accept» and «Decline» are equally prominent.
 * Rendered only in the browser, while there is no choice or when reopened from the footer.
 */
@Component({
  selector: 'km-consent-banner',
  imports: [RouterLink, Button],
  templateUrl: './consent-banner.html',
})
export class ConsentBanner {
  private readonly analytics = inject(AnalyticsService);
  protected readonly consent = inject(ConsentService);
  protected readonly paths = PATHS;

  onAccept(): void {
    this.consent.choose(true);
  }

  onDecline(): void {
    const wasAccepted = this.consent.$analytics() === true;
    this.consent.choose(false);
    if (wasAccepted) {
      // Loaded counters cannot be unloaded: drop their cookies and start clean.
      this.analytics.clearCookies();
      location.reload();
    }
  }
}
