import { Route } from '@angular/router';

import { PATHS, SeoRouteData, toRoutes } from '@karmanto/core';
import { legalDocument, legalTitle } from '@karmanto/legal/content';

const notFound: SeoRouteData = { noindex: true };

export const appRoutes: Route[] = toRoutes([
  {
    path: PATHS.home,
    pathMatch: 'full',
    loadComponent: () => import('@karmanto/home/page'),
    data: {
      description: $localize`:Home page|Meta description of the home page:Karmanto is a flashcard app for learning words with spaced repetition: add a word, answer «I know» or «Don't know», and it comes back right on time.`,
    } satisfies SeoRouteData,
  },
  {
    path: PATHS.privacy,
    loadComponent: () => import('@karmanto/legal/page'),
    title: legalTitle('privacy'),
    resolve: { document: legalDocument('privacy') },
    data: {
      description: $localize`:Privacy page|Meta description:How the Karmanto app and website collect, use and protect personal data.`,
    } satisfies SeoRouteData,
  },
  {
    path: PATHS.terms,
    loadComponent: () => import('@karmanto/legal/page'),
    title: legalTitle('terms'),
    resolve: { document: legalDocument('terms') },
    data: {
      description: $localize`:Terms page|Meta description:Terms of use of the Karmanto app and website.`,
    } satisfies SeoRouteData,
  },
  {
    path: PATHS.consent,
    loadComponent: () => import('@karmanto/legal/page'),
    title: legalTitle('consent'),
    resolve: { document: legalDocument('consent') },
    data: {
      description: $localize`:Consent page|Meta description:Consent to the processing of personal data sent through the Karmanto contact form.`,
    } satisfies SeoRouteData,
  },
  {
    path: PATHS.support,
    loadComponent: () => import('@karmanto/support/page'),
    title: $localize`:Support page|Page title in the browser tab:Support`,
    data: {
      description: $localize`:Support page|Meta description:Answers to common questions about Karmanto and how to contact support.`,
    } satisfies SeoRouteData,
  },
  {
    path: PATHS.deleteAccount,
    loadComponent: () => import('@karmanto/delete-account/page'),
    title: $localize`:Delete account page|Page title in the browser tab:Delete Account`,
    data: {
      description: $localize`:Delete account page|Meta description:How to delete your Karmanto account and what happens to your data.`,
    } satisfies SeoRouteData,
  },
  {
    path: PATHS.contact,
    loadComponent: () => import('@karmanto/contact/page'),
    title: $localize`:Contact page|Page title in the browser tab:Contact Us`,
    data: {
      description: $localize`:Contact page|Meta description:Send a message to the Karmanto team.`,
    } satisfies SeoRouteData,
  },
  {
    path: PATHS.notFound,
    loadComponent: () => import('@karmanto/not-found/page'),
    title: $localize`:Not found page|Page title in the browser tab:Page not found`,
    data: notFound,
  },
  // Must be the last one.
  {
    path: PATHS.any,
    loadComponent: () => import('@karmanto/not-found/page'),
    title: $localize`:Not found page|Page title in the browser tab:Page not found`,
    data: notFound,
  },
]);
