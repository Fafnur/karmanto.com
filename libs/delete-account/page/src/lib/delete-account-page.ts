import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { PATHS, SITE } from '@karmanto/core';
import { Button } from '@karmanto/ui/buttons';

/**
 * Account deletion instructions: the page Google Play links to.
 */
@Component({
  selector: 'km-delete-account-page',
  imports: [RouterLink, Button],
  templateUrl: './delete-account-page.html',
  host: { class: 'block max-w-3xl' },
})
export class DeleteAccountPage {
  protected readonly site = SITE;
  protected readonly paths = PATHS;
  protected readonly mailto = `mailto:${SITE.email}?subject=${encodeURIComponent(
    $localize`:Delete account page|Subject of the deletion request email:Account deletion`,
  )}`;
}
