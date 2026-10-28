import { DOCUMENT } from '@angular/common';
import { afterNextRender, Component, computed, inject, LOCALE_ID, signal } from '@angular/core';
import { email, form, FormField, FormRoot, maxLength, pattern, required, validate } from '@angular/forms/signals';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { AnalyticsService } from '@karmanto/analytics';
import { getLocale, PATHS, SITE } from '@karmanto/core';
import { Button } from '@karmanto/ui/buttons';

import { CONTACT_TOPICS, ContactResult, ContactTopic, sendContactMessage } from './contact-api';

interface ContactModel {
  name: string;
  email: string;
  telegram: string;
  topic: ContactTopic;
  message: string;
  consent: boolean;
  website: string;
}

export const MESSAGE_MIN = 10;
export const MESSAGE_MAX = 2000;

function emptyModel(topic: ContactTopic = 'question'): ContactModel {
  return { name: '', email: '', telegram: '', topic, message: '', consent: false, website: '' };
}

/**
 * Contact form: Signal Forms, validation mirrors the `contact` function (lengths after trimming).
 */
@Component({
  selector: 'km-contact-page',
  imports: [FormField, FormRoot, RouterLink, Button],
  templateUrl: './contact-page.html',
  host: { class: 'block max-w-2xl' },
})
export class ContactPage {
  private readonly locale = getLocale(inject(LOCALE_ID));
  private readonly document = inject(DOCUMENT);
  private readonly analytics = inject(AnalyticsService);
  private openedAt = 0;

  protected readonly site = SITE;
  protected readonly paths = PATHS;
  protected readonly messageMax = MESSAGE_MAX;
  protected readonly topics: Array<{ value: ContactTopic; label: string }> = CONTACT_TOPICS.map((value) => ({
    value,
    label: {
      question: $localize`:Contact form|Topic option:Question`,
      bug: $localize`:Contact form|Topic option:Problem in the app`,
      account_deletion: $localize`:Contact form|Topic option:Account deletion`,
      other: $localize`:Contact form|Topic option:Other`,
    }[value],
  }));

  protected readonly $model = signal<ContactModel>(emptyModel());
  protected readonly $result = signal<ContactResult | null>(null);
  protected readonly $sentTo = signal('');

  protected readonly contactForm = form(
    this.$model,
    (path) => {
      required(path.name, { message: $localize`:Contact form|Error under the name field:Enter your name` });
      validate(path.name, ({ value }) =>
        value().trim().length > 100
          ? { kind: 'maxLength', message: $localize`:Contact form|Error under the name field:Up to 100 characters` }
          : null,
      );
      required(path.email, { message: $localize`:Contact form|Error under the email field:Enter your email` });
      email(path.email, { message: $localize`:Contact form|Error under the email field:Check the email address` });
      maxLength(path.email, 254, { message: $localize`:Contact form|Error under the email field:Check the email address` });
      pattern(path.telegram, /^\s*@?[A-Za-z0-9_]{5,32}\s*$/, {
        message: $localize`:Contact form|Error under the Telegram field:5–32 Latin letters, digits or underscores`,
      });
      required(path.message, { message: $localize`:Contact form|Error under the message field:Write your message` });
      validate(path.message, ({ value }) => {
        const length = value().trim().length;
        if (length > 0 && length < MESSAGE_MIN) {
          return {
            kind: 'minLength',
            message: $localize`:Contact form|Error under the message field:At least ${MESSAGE_MIN}:min: characters`,
          };
        }
        return length > MESSAGE_MAX
          ? { kind: 'maxLength', message: $localize`:Contact form|Error under the message field:Up to ${MESSAGE_MAX}:max: characters` }
          : null;
      });
      validate(path.consent, ({ value }) =>
        value()
          ? null
          : {
              kind: 'required',
              message: $localize`:Contact form|Error under the consent checkbox:Your consent is needed to send the message`,
            },
      );
    },
    {
      submission: {
        action: async () => {
          const model = this.$model();
          const result = await sendContactMessage({
            name: model.name.trim(),
            email: model.email.trim(),
            telegram: model.telegram.trim() || null,
            topic: model.topic,
            message: model.message.trim(),
            locale: this.locale.id,
            website: model.website,
            elapsedMs: Date.now() - this.openedAt,
          });
          if (result === 'sent') {
            this.analytics.event('contact_submit', { topic: model.topic });
          }
          this.$sentTo.set(model.email.trim());
          this.$result.set(result);
          return undefined;
        },
        onInvalid: () => this.focusFirstError(),
      },
    },
  );

  protected readonly $messageLength = computed(() => this.$model().message.trim().length);

  constructor() {
    const topic = inject(ActivatedRoute).snapshot.queryParamMap.get('topic');
    if (CONTACT_TOPICS.includes(topic as ContactTopic)) {
      this.$model.update((model) => ({ ...model, topic: topic as ContactTopic }));
    }
    afterNextRender(() => (this.openedAt = Date.now()));
  }

  onReset(): void {
    this.contactForm().reset(emptyModel());
    this.$result.set(null);
    this.openedAt = Date.now();
  }

  private focusFirstError(): void {
    // Form state, not `aria-invalid` in the DOM: the attributes are not re-rendered yet at this point.
    const fields = [
      ['contact-name', this.contactForm.name],
      ['contact-email', this.contactForm.email],
      ['contact-telegram', this.contactForm.telegram],
      ['contact-message', this.contactForm.message],
      ['contact-consent', this.contactForm.consent],
    ] as const;
    const invalid = fields.find(([, field]) => field().invalid());
    if (invalid) {
      this.document.getElementById(invalid[0])?.focus();
    }
  }
}
