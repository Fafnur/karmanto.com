import { SITE } from '@karmanto/core';

export type ContactTopic = 'question' | 'bug' | 'account_deletion' | 'other';

export const CONTACT_TOPICS: ContactTopic[] = ['question', 'bug', 'account_deletion', 'other'];

export interface ContactRequest {
  readonly name: string;
  readonly email: string;
  readonly telegram: string | null;
  readonly topic: ContactTopic;
  readonly message: string;
  readonly locale: string;
  /** Honeypot: must stay empty. */
  readonly website: string;
  /** How long the form was open: the function treats fast submissions as bots. */
  readonly elapsedMs: number;
}

export type ContactResult = 'sent' | 'rate_limited' | 'failed';

/**
 * POST to the `contact` Edge Function (app repository, task 9.6): 200 → sent, 429 → too many messages,
 * anything else (400, 403 for a foreign origin, 500, network) → failed.
 */
export async function sendContactMessage(request: ContactRequest): Promise<ContactResult> {
  try {
    const response = await fetch(SITE.contact.url, {
      method: 'POST',
      headers: { 'content-type': 'application/json', apikey: SITE.contact.publishableKey },
      body: JSON.stringify(request),
    });

    if (response.ok) {
      return 'sent';
    }
    return response.status === 429 ? 'rate_limited' : 'failed';
  } catch {
    return 'failed';
  }
}
