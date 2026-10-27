import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';

import { App } from './app';
import { appRoutes } from './app.routes';

describe('App', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [App],
      providers: [provideRouter(appRoutes)],
    });
  });

  it('should render the home page', async () => {
    const harness = await RouterTestingHarness.create('/');
    expect(harness.routeNativeElement?.querySelector('h1')?.textContent).toContain('Karmanto');
  });

  it('should render the route title on a legal page', async () => {
    const harness = await RouterTestingHarness.create('/privacy');
    expect(harness.routeNativeElement?.querySelector('h1')?.textContent).toContain('Privacy Policy');
  });

  it('should render the not found page for unknown routes', async () => {
    const harness = await RouterTestingHarness.create('/unknown');
    expect(harness.routeNativeElement?.querySelector('h1')?.textContent).toContain('Page not found');
  });
});
