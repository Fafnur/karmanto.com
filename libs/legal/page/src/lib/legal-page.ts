import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

/**
 * Privacy, terms and consent: one page, the document comes with the route. Until task 3 — only the route title.
 */
@Component({
  selector: 'km-legal-page',
  templateUrl: './legal-page.html',
})
export class LegalPage {
  protected readonly title = inject(ActivatedRoute).snapshot.title;
}
