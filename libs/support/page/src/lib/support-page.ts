import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { FRAGMENTS, PATHS, SITE } from '@karmanto/core';
import { Button } from '@karmanto/ui/buttons';

interface Question {
  readonly question: string;
  readonly answer: string;
  /** Anchor for links from other pages (`/support/#google-sheet`); the item opens when the URL points to it. */
  readonly id?: string;
  readonly link?: { readonly label: string; readonly path: string };
}

interface Group {
  readonly id: string;
  readonly title: string;
  readonly questions: Question[];
}

/**
 * Support FAQ in groups and the contact block. Questions shown on the home page use the same strings.
 * Menu paths and button names match `app_*.arb` of the app.
 */
@Component({
  selector: 'km-support-page',
  imports: [RouterLink, Button],
  templateUrl: './support-page.html',
  host: { class: 'block max-w-3xl' },
})
export class SupportPage {
  protected readonly site = SITE;
  protected readonly paths = PATHS;
  protected readonly $fragment = toSignal(inject(ActivatedRoute).fragment);

  protected readonly groups: Group[] = [
    {
      id: 'faq-start',
      title: $localize`:Support page|FAQ group heading:Getting started`,
      questions: [
        {
          question: $localize`:Support FAQ|Question:What is Karmanto?`,
          answer: $localize`:Support FAQ|Answer to «What is Karmanto?»; I know and Don't know are answer buttons in the app:Karmanto is a flashcard app for iOS and Android for learning words in other languages. Add a word with its translation and study it with two buttons, “I know” and “Don't know”: the app uses spaced repetition to decide when to show each word again.`,
        },
        {
          question: $localize`:Support FAQ|Question; Inbox is a list name in the app:How do I add a word, and what is Inbox?`,
          answer: $localize`:Support FAQ|Answer about adding words; Inbox and Paste a list must match the app:Add a word with a translation and, if you like, a part of speech, a transcription, an example and a note. Inbox is the list for words you add on the go: every language has one, and you can sort its words into your own lists later. To add many words at once, use Paste a list.`,
        },
        {
          question: $localize`:Support FAQ|Question:Why do I need to sign in?`,
          answer: $localize`:Support FAQ|Answer about sign-in:Your words and progress are stored in your account, so they are on all your devices and are not lost when you change or reinstall your phone. You can sign in with Google or Apple.`,
        },
        {
          question: $localize`:Support FAQ|Question:Does Karmanto work without the internet?`,
          answer: $localize`:Support FAQ|Answer about offline use:Yes. You can add words and study without a connection: everything is saved on your phone and syncs when you are back online.`,
        },
      ],
    },
    {
      id: 'faq-study',
      title: $localize`:Support page|FAQ group heading:Studying`,
      questions: [
        {
          question: $localize`:Support FAQ|Question; I know and Don't know are answer buttons in the app:What do “I know” and “Don't know” do?`,
          answer: $localize`:Support FAQ|Answer about the two answer buttons:They tell the app whether you remembered the word. You don't need to grade how well you remembered: the app plans the next review from these two answers.`,
        },
        {
          question: $localize`:Support FAQ|Question:When will a word come back?`,
          answer: $localize`:Support FAQ|Answer about spaced repetition; I know and Don't know are answer buttons in the app:It depends on your answers. After “I know” the word comes back later each time, after “Don't know” — soon. Words you know well wait for weeks and months.`,
        },
        {
          question: $localize`:Support FAQ|Question; Learned is a word status in the app:What does “Learned” mean, and how do I bring a word back?`,
          answer: $localize`:Support FAQ|Answer about learned words; Review learned is a study mode, Don't know is an answer button in the app:“Learned” is a status: the word stays in its list but no longer comes up in study. You can mark a word as learned at any time, and the app suggests it for words that would not come back for a long time anyway. Learned words come back now and then in Review learned: answer “Don't know”, and the word is back in study.`,
        },
        {
          question: $localize`:Support FAQ|Question; Study, Review learned and Writing are study modes in the app:What are Study, Review learned and Writing?`,
          answer: $localize`:Support FAQ|Answer about study modes:Study shows new words and words that are due today, in short sessions. Review learned checks words you have marked as learned. In Writing you see the translation and type the word.`,
        },
      ],
    },
    {
      id: 'faq-words',
      title: $localize`:Support page|FAQ group heading:Words and lists`,
      questions: [
        {
          question: $localize`:Support FAQ|Question:Can I move my words from Quizlet?`,
          answer: $localize`:Support FAQ|Answer about moving words from Quizlet:Yes. Export a set from Quizlet and paste the text into Karmanto: the Quizlet format is read as is. You can also import a CSV file or connect a Google Sheet.`,
        },
        {
          id: FRAGMENTS.googleSheet,
          question: $localize`:Support FAQ|Question:How do I connect a Google Sheet?`,
          answer: $localize`:Support FAQ|Answer about Google Sheets:In the sheet's sharing settings, allow access to anyone with the link. Put words in column A and translations in column B, then paste the link to the sheet into the app. The list remembers the sheet: updating it from the sheet adds only new rows and doesn't change words you have edited in the app.`,
        },
        {
          question: $localize`:Support FAQ|Question:What happens when I pause a list?`,
          answer: $localize`:Support FAQ|Answer about pausing a list:A paused list keeps all its words and progress, but its words don't come up in study or reminders. Resume it whenever you like.`,
        },
        {
          question: $localize`:Support FAQ|Question:Where do deleted words go?`,
          answer: $localize`:Support FAQ|Answer about the trash; Trash is a name in the app:To Trash. Deleted words and lists wait there for 30 days, and you can restore them with all their progress. After 30 days they are deleted for good.`,
        },
      ],
    },
    {
      id: 'faq-settings',
      title: $localize`:Support page|FAQ group heading:Voice, reminders and settings`,
      questions: [
        {
          question: $localize`:Support FAQ|Question:Why don't I hear a word?`,
          answer: $localize`:Support FAQ|Answer about the system voice; phone menu paths as in the app:Words are read by your phone's voice. If there is no voice for the language, install one. On iPhone: Settings → Accessibility → Spoken Content → Voices. On Android: Settings → Accessibility → Text-to-speech output → engine settings → Install voice data; the path may differ on your phone.`,
        },
        {
          question: $localize`:Support FAQ|Question:How does the offline dictionary work?`,
          answer: $localize`:Support FAQ|Answer about the offline dictionary:When you add a word, the app can suggest a translation, even without the internet. Download the dictionary for your language pair once in the app settings: it takes some space on your phone.`,
        },
        {
          question: $localize`:Support FAQ|Question:How do I turn on reminders?`,
          answer: $localize`:Support FAQ|Answer about reminders; I know and Don't know are answer buttons in the app:Reminders are off by default. Turn them on in the app settings and allow notifications. A reminder shows a word, and you can answer “I know” or “Don't know” right in the notification.`,
        },
        {
          question: $localize`:Support FAQ|Question:How do I change the app language or theme?`,
          answer: $localize`:Support FAQ|Answer; Settings, Language and Theme with their options must match the app:Open Settings. In Language, choose System, English, Russian or Spanish; in Theme — System, Light or Dark.`,
        },
      ],
    },
    {
      id: 'faq-account',
      title: $localize`:Support page|FAQ group heading:Account`,
      questions: [
        {
          question: $localize`:Support FAQ|Question:How do I delete my account?`,
          answer: $localize`:Support FAQ|Answer; Settings → Account → Delete account must match the app menu:Open Settings → Account → Delete account. Your account and all your words, lists and progress are deleted on all your devices, immediately and permanently.`,
          link: {
            label: $localize`:Support FAQ|Link to the account deletion page:More about deleting your account`,
            path: PATHS.deleteAccount,
          },
        },
      ],
    },
  ];
}
