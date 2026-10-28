import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { FRAGMENTS, PATHS, SITE } from '@karmanto/core';
import { StoreButtons } from '@karmanto/ui/store-buttons';

import { LEARN_LANGUAGES } from './languages';
import { ModePreview, StudyMode } from './mode-preview/mode-preview';
import { StudyCard } from './study-card/study-card';

interface Item {
  readonly title: string;
  readonly text: string;
}

interface Mode extends Item {
  readonly mode: StudyMode;
}

@Component({
  selector: 'km-home-page',
  imports: [RouterLink, StoreButtons, StudyCard, ModePreview],
  templateUrl: './home-page.html',
  host: { class: 'block' },
})
export class HomePage {
  protected readonly paths = PATHS;
  protected readonly fragments = FRAGMENTS;
  protected readonly screenshots = SITE.screenshots;
  protected readonly languages = LEARN_LANGUAGES;

  protected readonly steps: Item[] = [
    {
      title: $localize`:Home page|How it works, step 1 title:Add a word`,
      text: $localize`:Home page|How it works, step 1 text:With a translation, a part of speech, a transcription and an example.`,
    },
    {
      title: $localize`:Home page|How it works, step 2 title:Answer with two buttons`,
      text: $localize`:Home page|How it works, step 2 text; I know and Don't know are answer buttons in the app:“I know” or “Don't know”. The app decides when the word comes back.`,
    },
    {
      title: $localize`:Home page|How it works, step 3 title:Learned it — mark it`,
      text: $localize`:Home page|How it works, step 3 text:Forgot it later? One tap brings it back to study.`,
    },
  ];

  // Mode names follow the app: «Start studying», «Review learned», «Writing».
  protected readonly modes: Mode[] = [
    {
      mode: 'study',
      title: $localize`:Study mode|Name of the main study mode in the app:Study`,
      text: $localize`:Home page|Description of the Study mode:New words and words that are due today, in short sessions.`,
    },
    {
      mode: 'review',
      title: $localize`:Study mode|Name of the mode that checks learned words in the app:Review learned`,
      text: $localize`:Home page|Description of the Review learned mode; Don't know is an answer button in the app:Learned words come back now and then for a check. “Don't know” — and the word goes back to study.`,
    },
    {
      mode: 'writing',
      title: $localize`:Study mode|Name of the writing mode in the app:Writing`,
      text: $localize`:Home page|Description of the Writing mode:See the translation, type the word and check your spelling.`,
    },
  ];

  protected readonly features: Item[] = [
    {
      title: $localize`:Home page|Feature title:Two answers instead of four grades`,
      text: $localize`:Home page|Feature text; I know and Don't know are answer buttons in the app:No need to rate how well you remembered: “I know” or “Don't know” is enough. The schedule is the app's job.`,
    },
    {
      title: $localize`:Home page|Feature title; Learned is a word status in the app:“Learned” is a status, not a list`,
      text: $localize`:Home page|Feature text:A learned word stays in its list. Forgot it later? Bring it back to study in one tap.`,
    },
    {
      title: $localize`:Home page|Feature title:Study only verbs`,
      text: $localize`:Home page|Feature text:Filter words by part of speech, or pause a list for a while without deleting it.`,
    },
    {
      title: $localize`:Home page|Feature title:Reminders you can answer`,
      text: $localize`:Home page|Feature text:A word and the answer buttons right in the notification. Reminders stay off until you turn them on.`,
    },
    {
      title: $localize`:Home page|Feature title:Hear it, look it up`,
      text: $localize`:Home page|Feature text:Your phone's voice reads words aloud, and translations work offline.`,
    },
    {
      title: $localize`:Home page|Feature title:Make it yours`,
      text: $localize`:Home page|Feature text:English, Russian or Spanish interface, light and dark themes, sign in with Google or Apple.`,
    },
  ];

  // Same strings as on the support page: one translation for both.
  protected readonly questions: Item[] = [
    {
      title: $localize`:Support FAQ|Question:Does Karmanto work without the internet?`,
      text: $localize`:Support FAQ|Answer about offline use:Yes. You can add words and study without a connection: everything is saved on your phone and syncs when you are back online.`,
    },
    {
      title: $localize`:Support FAQ|Question:Why do I need to sign in?`,
      text: $localize`:Support FAQ|Answer about sign-in:Your words and progress are stored in your account, so they are on all your devices and are not lost when you change or reinstall your phone. You can sign in with Google or Apple.`,
    },
    {
      title: $localize`:Support FAQ|Question:Can I move my words from Quizlet?`,
      text: $localize`:Support FAQ|Answer about moving words from Quizlet:Yes. Export a set from Quizlet and paste the text into Karmanto: the Quizlet format is read as is. You can also import a CSV file or connect a Google Sheet.`,
    },
    {
      title: $localize`:Support FAQ|Question:When will a word come back?`,
      text: $localize`:Support FAQ|Answer about spaced repetition; I know and Don't know are answer buttons in the app:It depends on your answers. After “I know” the word comes back later each time, after “Don't know” — soon. Words you know well wait for weeks and months.`,
    },
  ];
}
