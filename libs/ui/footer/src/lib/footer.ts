import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { PATHS, SITE } from '@karmanto/core';

/**
 * Site footer: documents, support, account deletion, contacts. «Cookie settings» comes with analytics (task 5).
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
}
