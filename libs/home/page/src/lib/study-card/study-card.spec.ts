import { TestBed } from '@angular/core/testing';

import { DECKS } from './decks';
import { StudyCard } from './study-card';

describe('StudyCard', () => {
  async function render() {
    const fixture = TestBed.createComponent(StudyCard);
    await fixture.whenStable();
    const element: HTMLElement = fixture.nativeElement;
    const [card, again, know] = Array.from(element.querySelectorAll('button'));
    const click = async (button: HTMLButtonElement) => {
      button.click();
      await fixture.whenStable();
    };
    return { element, card, again, know, click };
  }

  it('flips the card to the translation and back', async () => {
    const { element, card, click } = await render();
    const flipped = () => element.querySelector('.is-flipped') !== null;

    expect(flipped()).toBe(false);
    await click(card);
    expect(flipped()).toBe(true);
    await click(card);
    expect(flipped()).toBe(false);
  });

  it('shows the next card unflipped after an answer and starts over after the last one', async () => {
    const { element, card, again, know, click } = await render();
    const deck = DECKS.en;
    const term = () => element.querySelector('[lang]')?.textContent?.trim();

    expect(term()).toBe(deck[0].term);
    await click(card);
    await click(know);
    expect(term()).toBe(deck[1].term);
    expect(element.querySelector('.is-flipped')).toBeNull();

    for (let i = 1; i < deck.length; i++) {
      await click(again);
    }
    expect(term()).toBe(deck[0].term);
  });
});
