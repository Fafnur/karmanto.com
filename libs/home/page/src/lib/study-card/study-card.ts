import { Component, computed, inject, LOCALE_ID, signal } from '@angular/core';

import { getLocale } from '@karmanto/core';

import { DECKS, PARTS_OF_SPEECH } from './decks';

/**
 * The Study screen of the app in a phone frame: the card flips on tap or Enter/Space, «I know» and «Don't know» show
 * the next card, the last one is followed by the first. No animation with `prefers-reduced-motion`.
 */
@Component({
  selector: 'km-study-card',
  templateUrl: './study-card.html',
  host: { class: 'block' },
})
export class StudyCard {
  protected readonly cards = DECKS[getLocale(inject(LOCALE_ID)).id];
  protected readonly partsOfSpeech = PARTS_OF_SPEECH;

  protected readonly $index = signal(0);
  protected readonly $flipped = signal(false);
  // An array of one: `@for` recreates the card for the next word, so it does not turn back with the new word on it.
  protected readonly $current = computed(() => [this.cards[this.$index()]]);

  onFlip(): void {
    this.$flipped.update((flipped) => !flipped);
  }

  onAnswer(): void {
    this.$index.update((index) => (index + 1) % this.cards.length);
    this.$flipped.set(false);
  }
}
