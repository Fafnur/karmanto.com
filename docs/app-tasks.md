# Задачи для репозитория приложения (karmanto), связанные с сайтом

Добавить в `docs/plan.md` приложения (этап 9, «Выпуск») и выполнить там. **K.2 нужна до задачи 4 сайта.**
Образец обеих задач — задачи A.1 и A.2 сайта `isomantika.com` (`docs/app-tasks.md` образца) и их реализация в
репозитории Mantika (5.6, 5.7).

**K.1. Ссылки на поддержку.** В `AppLinks` (`lib/core/config/app_links.dart`) добавить `support(languageCode)` по
тому же правилу, что `privacyPolicy` и `terms`: `en` — `https://karmanto.com/support/`, остальные —
`/<lang>/support/`. Юнит-тест на три языка. Где показать в приложении (например, «Настройки» → «О приложении»:
поддержка, политика, условия, версия) — решить в grill. Записать в `docs/decisions.md`.

**K.2. Edge Function `contact` для формы на сайте.** Перенос из Mantika без изменений поведения:
- миграция: таблица `contact_messages` (`id uuid`, `created_at`, `name`, `email`, `telegram` null,
  `topic` check in (`question`, `bug`, `account_deletion`, `other`), `message`, `locale`, `ip_hash`); RLS включён,
  политик нет — доступ только у service role;
- функция `supabase/functions/contact`, в `config.toml` — `verify_jwt = false`; только POST и OPTIONS; CORS —
  источники из секрета `CONTACT_ALLOWED_ORIGINS` (`https://karmanto.com`);
- валидация как на сайте (имя до 100, email, ник `^@?[A-Za-z0-9_]{5,32}$` или пусто, тема из списка, сообщение
  10–2000 после обрезки пробелов, `locale` из `en|ru|es`) → 400 `invalid_request`;
- ловушка `website` или `elapsedMs < 3000` → 200 без сохранения;
- лимит: 5 сообщений в час с одного `ip_hash` (sha256 от IP + секрет `CONTACT_IP_SALT`) → 429 `rate_limited`;
- запись в таблицу, затем уведомление в **Telegram-бот Karmanto** (`TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`);
  ошибка Telegram логируется и не ломает ответ; ответ 200 `{ ok: true }`;
- структура как у `delete-account` и `purge`: `handler.ts` с зависимостями через интерфейс, `index.ts` — связывание,
  Deno-тесты (валидация, ловушка, лимит, сбой Telegram), pgTAP-тест: `anon` и `authenticated` не читают и не пишут
  `contact_messages`; секреты — в `supabase/.env.example` без значений; job `functions` в CI.
- Выкатка в облако — шаг в `docs/setup-auth.md` (или отдельный раздел): `supabase db push`, секреты,
  `supabase functions deploy contact`.

Записать в `docs/decisions.md`.
