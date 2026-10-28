import type { LocaleId } from '@karmanto/core';

export type PartOfSpeech = 'noun' | 'verb' | 'adverb' | 'phrase';

export interface DemoCard {
  /** The word being learned, in `lang`. */
  readonly term: string;
  readonly lang: string;
  readonly transcription?: string;
  /** In the page language. */
  readonly translation: string;
  readonly partOfSpeech: PartOfSpeech;
  /** In `lang`, like the term. */
  readonly example: string;
}

/** Part-of-speech labels, as in the app (`partOfSpeech` in `app_*.arb`). */
export const PARTS_OF_SPEECH: Record<PartOfSpeech, string> = {
  noun: $localize`:Part of speech|Label on a word card, as in the app:noun`,
  verb: $localize`:Part of speech|Label on a word card, as in the app:verb`,
  adverb: $localize`:Part of speech|Label on a word card, as in the app:adverb`,
  phrase: $localize`:Part of speech|Label on a word card, as in the app:phrase`,
};

/**
 * Cards of the phone demo on the first screen: data, not translations — each locale learns its own language.
 * English pages learn Spanish, Russian and Spanish pages learn English. The theme is «pocket».
 */
export const DECKS: Record<LocaleId, DemoCard[]> = {
  en: [
    { term: 'el bolsillo', lang: 'es', translation: 'pocket', partOfSpeech: 'noun', example: 'Siempre llevo las llaves en el bolsillo.' },
    { term: 'recordar', lang: 'es', translation: 'to remember', partOfSpeech: 'verb', example: 'No recuerdo su nombre.' },
    { term: 'siempre', lang: 'es', translation: 'always', partOfSpeech: 'adverb', example: 'Siempre voy al trabajo a pie.' },
    { term: 'de memoria', lang: 'es', translation: 'by heart', partOfSpeech: 'phrase', example: 'Me sé la canción de memoria.' },
  ],
  ru: [
    {
      term: 'pocket',
      lang: 'en',
      transcription: 'ˈpɒkɪt',
      translation: 'карман',
      partOfSpeech: 'noun',
      example: 'Keep the note in your pocket.',
    },
    {
      term: 'remember',
      lang: 'en',
      transcription: 'rɪˈmembə',
      translation: 'помнить',
      partOfSpeech: 'verb',
      example: "I can't remember her name.",
    },
    {
      term: 'always',
      lang: 'en',
      transcription: 'ˈɔːlweɪz',
      translation: 'всегда',
      partOfSpeech: 'adverb',
      example: 'She always walks to work.',
    },
    { term: 'by heart', lang: 'en', translation: 'наизусть', partOfSpeech: 'phrase', example: 'He knows the poem by heart.' },
  ],
  es: [
    {
      term: 'pocket',
      lang: 'en',
      transcription: 'ˈpɒkɪt',
      translation: 'bolsillo',
      partOfSpeech: 'noun',
      example: 'Keep the note in your pocket.',
    },
    {
      term: 'remember',
      lang: 'en',
      transcription: 'rɪˈmembə',
      translation: 'recordar',
      partOfSpeech: 'verb',
      example: "I can't remember her name.",
    },
    {
      term: 'always',
      lang: 'en',
      transcription: 'ˈɔːlweɪz',
      translation: 'siempre',
      partOfSpeech: 'adverb',
      example: 'She always walks to work.',
    },
    { term: 'by heart', lang: 'en', translation: 'de memoria', partOfSpeech: 'phrase', example: 'He knows the poem by heart.' },
  ],
};
