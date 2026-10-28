import { TestBed } from '@angular/core/testing';

import { ANALYTICS_CONFIG } from './analytics.config';
import { CONSENT_STORAGE_KEY, CONSENT_VERSION, ConsentService } from './consent.service';

function setup(config = { googleAnalyticsId: 'G-TEST', yandexMetrikaId: 0 }): ConsentService {
  TestBed.configureTestingModule({ providers: [{ provide: ANALYTICS_CONFIG, useValue: config }] });
  return TestBed.inject(ConsentService);
}

describe('ConsentService', () => {
  beforeEach(() => localStorage.clear());

  it('opens the banner after restore while there is no choice', () => {
    const consent = setup();

    expect(consent.$bannerOpen()).toBe(false);
    consent.restore();
    expect(consent.$bannerOpen()).toBe(true);
  });

  it('remembers the choice with the version', () => {
    const consent = setup();
    consent.restore();
    consent.choose(true);

    expect(consent.$bannerOpen()).toBe(false);
    expect(JSON.parse(localStorage.getItem(CONSENT_STORAGE_KEY) ?? '{}')).toMatchObject({ v: CONSENT_VERSION, analytics: true });
  });

  it('asks again when the stored version is outdated', () => {
    localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify({ v: CONSENT_VERSION - 1, analytics: true, at: '' }));
    const consent = setup();
    consent.restore();

    expect(consent.$analytics()).toBeNull();
    expect(consent.$bannerOpen()).toBe(true);
  });

  it('reopens from the footer', () => {
    localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify({ v: CONSENT_VERSION, analytics: false, at: '' }));
    const consent = setup();
    consent.restore();
    expect(consent.$bannerOpen()).toBe(false);

    consent.open();
    expect(consent.$bannerOpen()).toBe(true);
  });

  it('never shows the banner without counters', () => {
    const consent = setup({ googleAnalyticsId: '', yandexMetrikaId: 0 });
    consent.restore();

    expect(consent.enabled).toBe(false);
    expect(consent.$bannerOpen()).toBe(false);
  });
});
