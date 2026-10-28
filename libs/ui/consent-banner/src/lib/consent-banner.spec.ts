import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { ANALYTICS_CONFIG, ConsentService } from '@karmanto/analytics';

import { ConsentBanner } from './consent-banner';

describe('ConsentBanner', () => {
  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [provideRouter([]), { provide: ANALYTICS_CONFIG, useValue: { googleAnalyticsId: 'G-TEST', yandexMetrikaId: 0 } }],
    });
  });

  it('offers equally prominent buttons and hides after a choice', async () => {
    const consent = TestBed.inject(ConsentService);
    consent.restore();
    const fixture = TestBed.createComponent(ConsentBanner);
    await fixture.whenStable();

    const buttons: HTMLButtonElement[] = Array.from(fixture.nativeElement.querySelectorAll('button'));
    expect(buttons.map((button) => button.textContent?.trim())).toEqual(['Accept', 'Decline']);
    expect(buttons[0].className).toBe(buttons[1].className);

    buttons[1].click();
    await fixture.whenStable();

    expect(consent.$analytics()).toBe(false);
    expect(fixture.nativeElement.querySelector('section')).toBeNull();
  });
});
