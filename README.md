# Karmanto — words that are always with you

**[karmanto.com](https://karmanto.com)** · flashcards for iOS and Android · English, Русский, Español

Like slips of paper with words you carry in your pocket — but with spaced repetition. Add a word and learn it; learned
it — mark it; forgot it — bring it back.

## How it works

1. **Add a word** — with a translation, a part of speech, a transcription, an example and a note.
2. **Learn with two buttons** — «I know» or «Don't know». The app decides when to show the word again.
3. **Learned it — mark it, forgot it — bring it back.** «Learned» is a status, not a separate list.

## What makes it different

- **Three study modes:** Study, Review of learned words, Writing.
- **Bring your words with you:** paste text, import CSV or a Google Sheet; the Quizlet format works as is.
- **33 languages to learn**, translations into 59.
- **Works offline**, syncs across your devices after sign-in. Deleted words wait in the trash for 30 days.
- **Part of speech as a filter** — study only verbs. Pause a list without deleting it.
- **Reminders with a word** and the answer buttons right in the notification. Off by default.
- **System voice and an offline dictionary.** Three interface languages, light and dark themes, sign in with Google
  or Apple.

## Get the app

Coming soon to the App Store and Google Play.

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
