import type { Route } from '@angular/router';

/**
 * Every address of the site. The app links to `privacy` and `terms` — never change them (see the contract e2e).
 */
export const PATHS = {
  current: '',
  any: '**',

  home: '/',
  privacy: '/privacy',
  terms: '/terms',
  consent: '/consent',
  support: '/support',
  deleteAccount: '/delete-account',
  contact: '/contact',
  notFound: '/404',
} as const;

/**
 * Sections of the home page, linked as `/#features`.
 */
export const FRAGMENTS = {
  how: 'how',
  features: 'features',
} as const;

export type PathValues = (typeof PATHS)[keyof typeof PATHS];

export interface NavigationRoute extends Route {
  readonly path: PathValues;
  readonly children?: NavigationRoute[];
}

/**
 * Converts `PATHS` values to router paths: `/privacy` → `privacy`, children relative to their parent.
 */
export function toRoutes(routes: NavigationRoute[], parent = ''): Route[] {
  return routes.map((route) => {
    const children = route.children ? toRoutes(route.children, route.path.replace(/^\//, '')) : undefined;

    if (route.path === PATHS.current || route.path === PATHS.any) {
      return { ...route, children };
    }

    const path = route.path.replace(/^\//, '');

    return { ...route, path: parent ? path.replace(`${parent}/`, '') : path, children };
  });
}
