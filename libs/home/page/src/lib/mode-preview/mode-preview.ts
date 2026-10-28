import { Component, input } from '@angular/core';

export type StudyMode = 'study' | 'review' | 'writing';

/**
 * A small drawing of a study mode screen: a card and its controls, without text. Decorative.
 */
@Component({
  selector: 'km-mode-preview',
  templateUrl: './mode-preview.html',
  host: { class: 'block', 'aria-hidden': 'true' },
})
export class ModePreview {
  readonly $mode = input.required<StudyMode>({ alias: 'mode' });
}
