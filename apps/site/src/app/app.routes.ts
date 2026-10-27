import { Route } from '@angular/router';

import { PATHS, toRoutes } from '@karmanto/core';

export const appRoutes: Route[] = toRoutes([
  {
    path: PATHS.home,
    pathMatch: 'full',
    loadComponent: () => import('@karmanto/home/page'),
  },
  {
    path: PATHS.privacy,
    loadComponent: () => import('@karmanto/legal/page'),
    title: $localize`:Privacy page|Page title in the browser tab:Privacy Policy`,
  },
  {
    path: PATHS.terms,
    loadComponent: () => import('@karmanto/legal/page'),
    title: $localize`:Terms page|Page title in the browser tab:Terms of Use`,
  },
  {
    path: PATHS.consent,
    loadComponent: () => import('@karmanto/legal/page'),
    title: $localize`:Consent page|Page title in the browser tab:Consent to Personal Data Processing`,
  },
  {
    path: PATHS.support,
    loadComponent: () => import('@karmanto/support/page'),
    title: $localize`:Support page|Page title in the browser tab:Support`,
  },
  {
    path: PATHS.deleteAccount,
    loadComponent: () => import('@karmanto/delete-account/page'),
    title: $localize`:Delete account page|Page title in the browser tab:Delete Account`,
  },
  {
    path: PATHS.contact,
    loadComponent: () => import('@karmanto/contact/page'),
    title: $localize`:Contact page|Page title in the browser tab:Contact Us`,
  },
  {
    path: PATHS.notFound,
    loadComponent: () => import('@karmanto/not-found/page'),
    title: $localize`:Not found page|Page title in the browser tab:Page not found`,
  },
  // Must be the last one.
  {
    path: PATHS.any,
    loadComponent: () => import('@karmanto/not-found/page'),
    title: $localize`:Not found page|Page title in the browser tab:Page not found`,
  },
]);
