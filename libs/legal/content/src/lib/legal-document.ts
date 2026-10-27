export type LegalDocumentId = 'privacy' | 'terms' | 'consent';

export interface LegalDocument {
  readonly title: string;
  /** Date of the last revision, `YYYY-MM-DD`. */
  readonly updated: string;
  /** No translation for this locale: the English text is shown. */
  readonly fallback: boolean;
  /** `##` sections: ids are the same in every locale. */
  readonly toc: Array<{ readonly id: string; readonly title: string }>;
  readonly html: string;
}
