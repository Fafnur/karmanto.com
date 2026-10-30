---
title: Privacy Policy
updated: 2026-10-27
---

This Privacy Policy explains what personal data we collect when you use the Karmanto mobile app (iOS and Android)
and the website karmanto.com, why we collect it, who we share it with, how long we keep it and what rights you have.

We collect as little as we need to run the service. We do not show ads, do not sell your data and do not track you
across other apps or websites.

## Who we are

Karmanto is operated by **Aleksandr Serenko**, a private individual based in Russia (“we”, “us”). We are the
controller of your personal data.

Contact for any privacy question or request: **support@karmanto.com**.

## Data we collect

### Your account

You sign in to the app with Google or Apple. From your sign-in provider we receive and store:

- a unique account identifier;
- your email address. If you use Sign in with Apple and choose “Hide My Email”, we receive a private relay address
  instead of your real one;
- which provider you used to sign in;
- your name and a link to your profile picture, if Google includes them in the sign-in data. We do not display or
  use them.

We do not receive your Google or Apple password.

### Your words and progress

So that your words are available on all your devices, we store in our database what you add to the app:

- the languages you are learning and the languages you translate into;
- lists: the name, order, whether the list is paused, and a link to a Google Sheet if you have connected one to the list;
- words: the word itself, the translation, part of speech, transcription, an example and a note;
- learning progress: the status (“Learned” or not), the review schedule and a log of your “I know” / “Don't know”
  answers with the date, time and study mode;
- deleted words and lists while they are in the trash.

We need this data to show your words, schedule reviews and sync your devices.

**Please do not put sensitive information in your words and notes**, such as health details, other people's data or
anything that identifies you. The service does not need it.

### Importing words

Text and CSV files that you import words from are processed on your device — the files themselves are not sent to us;
we store only the words you add. If you connect a Google Sheet, the app downloads it from Google using the link you
provided (the sheet must be accessible via the link), and we store the link with the list so that the “Refresh from
sheet” button works.

### Features available to some users

Some features are not available to all users (currently only to testers). If you have them and use them:

- **AI suggestions** — we send a language model the word (or a list of words when importing) and the language pair,
  and receive translation options, part of speech, transcription and an example. See “AI suggestions, images and
  voice-over” for details.
- **Stock images** — we send the stock image provider a search query (usually the word itself). The image you choose
  is saved in our cloud storage together with the word.
- **Neural voice-over** — we send the speech synthesis provider the text to be voiced (the word or an example). The
  audio file is saved in our cloud storage together with the word.
- **Your photo in the cloud** — a photo you add to a word is uploaded to our cloud storage so that it is available on
  all your devices.

### Messages to support

If you email us, we receive your email address, the text of your message and anything you attach to it.

### Contact form on the website

If you send a message through the form at karmanto.com/contact, we receive: your name, email address, Telegram username
(optional), the topic, your message and the website language. For spam protection we also process a one-way hash of
your IP address and the time it took to fill in the form. This processing is based on your consent — see the
[Consent to the Processing of Personal Data](/consent/).

### Technical data

Our servers and service providers automatically process technical data needed to deliver the service and keep it
secure: IP address, request time, device and operating system type, and error information. This data is kept in
server logs for a short period.

### App analytics and crash reports

The app uses Firebase Analytics and Firebase Crashlytics, provided by Google:

- **Analytics** — which screens you open and what you do in the app (for example, adding words, completing a study
  session, changing settings); the app version, device and operating system type, language, approximate country, and
  how you found the app in the store. We do **not** send your words, translations, notes or email address. Analytics
  uses an app instance identifier, not your account. You can turn analytics off in the app settings.
- **Crash reports** — when the app crashes or runs into an error: details of the error, the app version, device and
  operating system type, and your account identifier, so that we can match a problem you report to support. Crash
  reports are sent even if analytics is turned off, because they are needed to keep the app working.

We do not use the advertising identifier, do not show ads and do not use this data for advertising.

### Website analytics (only with your consent)

If you click “Accept” in the cookie banner on karmanto.com, we use Google Analytics and Yandex Metrica to understand
how the website is used: pages visited, referring site, approximate location (city or country), device and browser
type, and clicks on app store links. If you click “Decline” or do nothing, these services are not loaded at all.
Session recording (Yandex Metrica Webvisor) is turned off.

### Data stored only on your device

- **Your photo for a word** (if the “Your photo in the cloud” feature is not available to you) is stored only on that
  device and is not sent to us.
- **System voice-over** uses the voice installed on your phone; the text is not sent to us.
- **Offline dictionary.** Translation models are downloaded from Google's servers (Google sees the device's IP address
  during the download), and the translation itself runs on your device: your words are not sent anywhere.
- **Reminders** are local notifications scheduled by the app itself. We do not use notification servers and do not
  store push notification tokens.
- The app settings (interface language, theme, study and reminder settings), a copy of your words for offline use and
  a sign-in session token so that you stay signed in.

When you sign out, the data on your device is erased.

### What we do not collect

We do not collect your precise location, contacts, payment information or advertising identifier. The app accesses
your photos and files only when you choose an image or a file to import yourself. The app has no advertising.

## How and why we use your data

| Purpose | Data | Legal basis (for users in the EU, EEA and UK) |
|---|---|---|
| Creating and maintaining your account, signing you in | Account data | Performance of a contract (the Terms of Use) |
| Storing your words, scheduling reviews, syncing your devices | Words and progress | Performance of a contract |
| Importing from a Google Sheet and refreshing from it | Link to the sheet | Performance of a contract |
| AI suggestions, images, neural voice-over, photos in the cloud | Words, search queries, files | Performance of a contract |
| Preventing abuse, keeping the service secure | Account data, technical data | Our legitimate interest in a stable and fair service |
| Answering your support requests | Support messages | Performance of a contract and our legitimate interest |
| Answering messages from the contact form | Contact form data | Your consent |
| Understanding how the app is used and improving it | App analytics | Our legitimate interest in improving the service; you can turn analytics off in the app |
| Finding and fixing crashes and errors | Crash reports | Our legitimate interest in a working app |
| Understanding how the website is used | Website analytics data | Your consent |
| Complying with the law | Any data, as required | Legal obligation |

We do not use your data for automated decisions that have legal or similarly significant effects on you.

## AI suggestions, images and voice-over

These features are available to some users (see “Features available to some users”). Requests to external services
are sent by our server, not by the app. **We do not send them your name, email address or account identifier.**

- **AI suggestions.** The request goes through OpenRouter, a service that routes it to a language model provider; the
  model may run on servers of different hosting providers. In our OpenRouter settings we exclude providers that use
  requests to train their models. Providers may keep requests for a limited time under their own policies to prevent
  abuse. Suggestions are generated automatically and may be inaccurate — please check them.
- **Stock images** — the stock image provider receives only the search query.
- **Neural voice-over** — the speech synthesis provider receives only the text to be voiced.

## Who we share data with

We share data only with service providers that help us run Karmanto, and only to the extent they need:

| Provider | What it does | Where data is processed |
|---|---|---|
| Supabase, Inc. | Sign-in, database, file storage, server functions | Servers in the EU (Germany) |
| Google LLC | Sign in with Google; downloading offline dictionary models; Google Sheets, if you connect them; Firebase Analytics and Crashlytics in the app; Google Analytics on the website (with consent) | USA and other countries |
| Apple Inc. | Sign in with Apple | USA and other countries |
| OpenRouter, Inc. and the language model provider it routes the request to | AI suggestions (for some users) | USA and other countries |
| Stock image provider | Image search (for some users) | USA, EU and other countries |
| Speech synthesis provider | Neural voice-over (for some users) | USA, EU and other countries |
| YANDEX LLC | Yandex Metrica on the website (with consent) | Russia |
| Majordomo LLC | Website hosting | Russia |
| Telegram | Notifying us of new contact form messages (the message is delivered to our private chat) | Worldwide |
| Our email service provider | Receiving and answering support emails | USA and other countries |

We may also disclose data when required by law or to protect the rights and safety of users and the service.

We do not sell or rent personal data and do not share it for advertising.

## International transfers

We are based in Russia, and our service providers are located in the EU, the USA, Russia and other countries. Your
data may therefore be processed outside your country, including in countries that do not provide the same level of
data protection as yours. For users in the EU, EEA and UK, transfers are necessary to provide the service you asked
for, and where available they rely on safeguards offered by our providers, such as the European Commission's
Standard Contractual Clauses or the EU–U.S. Data Privacy Framework.

## How long we keep data

- **Account, words and progress** — while your account exists.
- **Trash** — deleted words and lists stay in the trash for 30 days and are then deleted from our database together
  with their progress and files. Words you delete from the trash permanently are deleted during the next daily
  cleanup.
- **When you delete your account** — your account and all your languages, lists, words, progress and files in cloud
  storage are deleted immediately and permanently on all your devices. If you signed in with Apple on an iPhone or
  iPad, we also revoke the app's access to your Apple ID. If you signed in with Apple on Android, you can revoke this
  access yourself in your Apple ID settings, under Sign in with Apple.
- **Support emails and contact form messages** — one year after our last reply.
- **Server logs** — a short period set by our providers, usually no more than a few weeks.
- **Backups** — deleted data may remain in database backups for a short time until they are overwritten.
- **App analytics** — 14 months.
- **Crash reports** — 90 days.
- **Website analytics** — according to the retention settings of Google Analytics (no more than 14 months) and Yandex
  Metrica.

## Your rights

Depending on where you live, you have the right to:

- get a copy of your personal data;
- correct inaccurate data;
- delete your data;
- restrict or object to processing;
- receive your data in a portable format;
- withdraw your consent at any time (this does not affect processing that happened before);
- lodge a complaint with your local data protection authority.

**Deleting your account:** in the app, go to Settings → Account → Delete account. If you cannot access the app, see
[how to delete your account](/delete-account/).

For any other request, write to support@karmanto.com from the email address you used to sign in. We will reply within
30 days.

## Cookies and similar technologies

**Website.** We store your cookie choice, the website theme and whether you closed the language suggestion in your
browser's local storage — this is needed for the site to work and is not used to track you. Analytics cookies (for
example `_ga`, `_ga_*`, `_ym_*`) are set only after you click “Accept”. You can change your choice at any time with
the “Cookie settings” link at the bottom of every page.

**App.** The app does not use cookies. It stores a sign-in session token, your settings and a copy of your words on
your device. Firebase stores an app instance identifier on your device for analytics and crash reports.

## Age restriction

Karmanto is intended for people **16 years of age or older**. We do not knowingly collect data from anyone under 16.
If you believe a child under 16 has created an account, write to us and we will delete it.

## Security

Data is transmitted over encrypted connections (HTTPS). Access rules for the database and file storage ensure that
each user can see only their own data. Access keys for external services are stored on the server and are never
included in the app. No system is perfectly secure, but we take reasonable measures to protect your data.

## Changes to this policy

We may update this policy when the service changes. The date of the latest version is shown at the top of this page.
We will notify you in the app or on the website about significant changes in advance.

## Contact

Aleksandr Serenko — support@karmanto.com

This policy is available in English, Russian and Spanish. If the versions differ, the English version prevails.
