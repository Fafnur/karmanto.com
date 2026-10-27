import { inject, LOCALE_ID } from '@angular/core';
import { ResolveFn } from '@angular/router';

import { getLocale, LocaleId } from '@karmanto/core';

import { LegalDocument, LegalDocumentId } from './legal-document';

type Loader = () => Promise<{ default: LegalDocument }>;

// One chunk per document and locale: a page loads only its own text.
const LOADERS: Record<LegalDocumentId, Record<LocaleId, Loader>> = {
  privacy: {
    en: () => import('../generated/privacy.en'),
    ru: () => import('../generated/privacy.ru'),
    es: () => import('../generated/privacy.es'),
  },
  terms: {
    en: () => import('../generated/terms.en'),
    ru: () => import('../generated/terms.ru'),
    es: () => import('../generated/terms.es'),
  },
  consent: {
    en: () => import('../generated/consent.en'),
    ru: () => import('../generated/consent.ru'),
    es: () => import('../generated/consent.es'),
  },
};

export async function loadLegalDocument(id: LegalDocumentId, locale: string): Promise<LegalDocument> {
  return (await LOADERS[id][getLocale(locale).id]()).default;
}

/**
 * Route resolver: `resolve: { document: legalDocument('privacy') }`.
 */
export function legalDocument(id: LegalDocumentId): ResolveFn<LegalDocument> {
  return () => loadLegalDocument(id, inject(LOCALE_ID));
}

/**
 * Route title from the document itself, so the tab and the heading never diverge: `title: legalTitle('privacy')`.
 */
export function legalTitle(id: LegalDocumentId): ResolveFn<string> {
  return async () => (await loadLegalDocument(id, inject(LOCALE_ID))).title;
}
