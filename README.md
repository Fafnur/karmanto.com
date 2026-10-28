# Karmanto — words that are always with you

**[karmanto.com](https://karmanto.com)** · flashcards for iOS and Android · English, Русский, Español

Like slips of paper with words you carry in your pocket — but with spaced repetition. Add a word, answer with two
buttons, and Karmanto decides when to show it again.

## How it works

1. **Add a word** — with a translation, a part of speech, a transcription and an example.
2. **Answer with two buttons** — “I know” or “Don't know”. The app decides when the word comes back.
3. **Learned it — mark it** — forgot it later? One tap brings it back to study.

## Three ways to study

- **Study** — new words and words that are due today, in short sessions.
- **Review learned** — learned words come back now and then for a check. “Don't know” — and the word goes back to study.
- **Writing** — see the translation, type the word and check your spelling.

## Bring your words with you

Paste a text, import a CSV or connect a Google Sheet and update it later with one tap. Lists exported from Quizlet work
as they are.

## Offline and in sync

Study on the subway without a signal. After sign-in your words are on all your devices. Deleted words wait in the trash
for 30 days.

## 33 languages to learn

And translations into 59 languages.

## What makes it different

- **Two answers instead of four grades** — no need to rate how well you remembered: “I know” or “Don't know” is
  enough. The schedule is the app's job.
- **“Learned” is a status, not a list** — a learned word stays in its list. Forgot it later? Bring it back to study in
  one tap.
- **Study only verbs** — filter words by part of speech, or pause a list for a while without deleting it.
- **Reminders you can answer** — a word and the answer buttons right in the notification. Reminders stay off until you
  turn them on.
- **Hear it, look it up** — your phone's voice reads words aloud, and translations work offline.
- **Make it yours** — English, Russian or Spanish interface, light and dark themes, sign in with Google or Apple.

## Get the app

Your words, always in your pocket. Karmanto is coming to iPhone and Android.

## Support

- [Questions and answers](https://karmanto.com/support/) · [Delete your account](https://karmanto.com/delete-account/)
- Write to **[support@karmanto.com](mailto:support@karmanto.com)**
- [Privacy Policy](https://karmanto.com/privacy/) · [Terms of Use](https://karmanto.com/terms/)

The app is intended for users aged 16 and over.

---

## About this repository

This is the source of the [karmanto.com](https://karmanto.com) website: a static site built with Angular (prerendered,
SSG) in an Nx monorepo.

Requirements: Node.js 24 (`.nvmrc`), Yarn 4 via Corepack (`corepack enable`).

```sh
yarn install
yarn start    # dev server, http://localhost:4200
yarn build    # static site in dist/apps/site/browser
yarn serve    # build and serve the static site (as in production)
yarn check    # lint, test, build, e2e
```

Plan, progress and decisions (in Russian): [`docs/plan.md`](docs/plan.md), [`docs/progress.md`](docs/progress.md),
[`docs/decisions.md`](docs/decisions.md).
