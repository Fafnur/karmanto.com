export type StoreId = 'appStore' | 'googlePlay';

/**
 * Brand, contacts and stores in one place.
 */
export const SITE = {
  name: 'Karmanto',
  origin: 'https://karmanto.com',
  email: 'support@karmanto.com',
  ogImage: '/og.png',
  /** Store pages; `null` until the app is published — the site shows «Coming soon» instead of a badge. */
  stores: {
    appStore: null,
    googlePlay: null,
  } as Record<StoreId, string | null>,
  /**
   * Contact form → Edge Function `contact` of the app's Supabase project. Public by design: the publishable key only
   * identifies the project; the function accepts requests from `CONTACT_ALLOWED_ORIGINS` only. Filled in task 4.
   */
  contact: {
    url: '',
    publishableKey: '',
  },
} as const;
