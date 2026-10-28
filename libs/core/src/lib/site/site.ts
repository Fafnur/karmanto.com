import type { LocaleId } from '../locales/locales';

export type StoreId = 'appStore' | 'googlePlay';

export interface Screenshot {
  /** File name without extension: `public/screenshots/{locale}/{name}.webp`. */
  readonly name: string;
  /** Locales that have their own file; the others fall back to English. */
  readonly locales: LocaleId[];
}

/**
 * Brand, contacts, stores and screenshots in one place.
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
   * identifies the project; the function accepts requests from `CONTACT_ALLOWED_ORIGINS` only.
   */
  contact: {
    url: 'https://dmdlrsdhxakjyhuadbtc.supabase.co/functions/v1/contact',
    publishableKey: 'sb_publishable_1ph7XR1jaFIGoPV7MCcArg_h5_HxFD3',
  },
  /** App screenshots for the home page gallery; empty — the gallery is hidden. */
  screenshots: [] as Screenshot[],
} as const;
