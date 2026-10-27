# karmanto.com

Сайт мобильного приложения Karmanto (карточки для запоминания слов, iOS и Android): маркетинговая страница,
юридические документы, поддержка, удаление аккаунта, форма обратной связи. Чистая статика: Angular SSG → свой
сервер (nginx; деплой — отдельная задача, пока CI только проверяет). Полный план — `docs/plan.md`.

Образец — репозиторий `isomantika.com`: архитектура, страницы и бизнес-логика переносятся из него почти один в один,
меняются бренд, цвета, шрифт и тексты. Решения образца (`docs/decisions.md` образца) действуют, если в
`docs/decisions.md` этого репозитория не сказано иначе.

## Стек

- Nx-монорепа, Yarn 4 (`nodeLinker: node-modules`). Только `yarn`, не `npm`.
- Angular 22: standalone, zoneless, гидрация. `OnPush` — по умолчанию в Angular 22: `changeDetection` в компонентах
  не пишем; `Eager` (бывший `Default`) — только с обоснованием в `docs/decisions.md`. Сборщик `@angular/build` (esbuild).
- SSG: `outputMode: "static"`, все серверные роуты `RenderMode.Prerender`. Express/Node-сервера нет.
- Стили: глобальный `apps/site/src/styles.scss`, **Tailwind 3.4** (`apps/site/tailwind.config.js`, Angular
  подхватывает его сам). Не v4: сайт должен работать в старых браузерах из `.browserslistrc`. Токены — палитра
  «Песочная» приложения в `theme.extend`: `bg-background`, `bg-paper`, `border-outline`, `text-ink`,
  `text-ink-secondary`, `text-ink-muted`, `bg-primary`, `text-on-primary`, `bg-primary-container`, `text-know`,
  `text-again`, `text-error`, `shadow-paper`; радиусы `rounded-button` (14), `rounded-card` (18), `rounded-block` (24),
  `rounded-full`. Значения цветов — CSS-переменные светлой и тёмной темы в `styles.scss`, новый цвет — в обе темы.
  Модификаторы прозрачности (`bg-primary/50`) — да, утилиты `bg-opacity-*` выключены.
- Темы: без класса на `<html>` — системная (`prefers-color-scheme`, по умолчанию), `theme-light`, `theme-dark`.
  Скрипт в `index.html` ставит класс и `theme-color` до первой отрисовки; ключ и цвета — общие с `ThemeService`
  (`@karmanto/ui/theme-menu`).
- Шрифт — только Noto Sans variable (как в приложении, `font-sans`): файлы `@fontsource-variable/noto-sans`
  копируются в `/fonts/` (`assets`), `@font-face` с `unicode-range` — в `styles.scss`: `latin`, `latin-ext`,
  `cyrillic`, `greek`, `vietnamese`. Preload шрифта локали — `provideFontPreload()` в серверном конфиге.
- Бренд — иконка приложения как есть (`favicon.svg`, она же в шапке) + вордмарк текстом; правила — `brandbook/README.md`.
- Адаптивность — три разрешения на брейкпоинтах Tailwind, mobile-first: handset (< 768 px, без префикса),
  tablet (`md:`, 768–1023 px), web (`lg:`, ≥ 1024 px). e2e гоняются на всех трёх (Pixel 7, 820×1180, Desktop).
- Старые браузеры: синтаксис понижает сборка, недостающие API — точечные модули `core-js/stable/*` в
  `polyfills` (`apps/site/project.json`). Новый API в коде или в бандле Angular — добавить модуль туда.
  `.ts`-файл в `polyfills` не класть: Angular тогда считает приложение zone-based и ломает пререндер.
- Тесты: Vitest — в приложении через `@angular/build:unit-test`, в библиотеках через `@nx/vitest` + AnalogJS
  (`vitest-analog`, умолчание генератора); e2e — Playwright по собранной статике (`site:serve-static`
  на `http-server`), Chromium desktop, tablet и mobile.

## Переводы

- Языки: `en` — исходный, в корне; `ru` → `/ru/`, `es` → `/es/`.
- Гидрация с i18n — только с `withI18nSupport()`: без него Angular молча перерисовывает страницы заново.
- Строки в шаблонах — `i18n="Meaning|Description"`, в коде — `$localize`, без `@@id`.
- `i18n` — только на элементе, где один текст без вложенных тегов (иначе обернуть текст в `<span>`).
- Плейсхолдеры в `$localize` — с именем: `` $localize`:Meaning|Description:Привет, ${name}:name:` ``.
- После изменения строк: `yarn nx extract-i18n site` → в `apps/site/src/locale/messages.{ru,es}.xlf` добавить или
  обновить `<target>` для новых и изменённых `trans-unit`, удалить устаревшие (скилл `update-i18n`). Без перевода
  сборка падает (`i18nMissingTranslation: error`).
- Подписи и пути меню приложения — дословно из `lib/l10n/app_{en,ru,es}.arb` репозитория приложения, когда они там есть.
- Адреса — со слешем на конце (`/privacy/`, `/ru/support/`).

## Проекты

- `apps/site` — сайт (префикс селекторов `km`).
- `brandbook/` — мини-брендбук (англ.): имя, иконка, цвета, шрифт, файлы сайта.
- `apps/site-e2e` — e2e. `contract.spec.ts` закрепляет адреса, которые открывает приложение: их не менять.
- `libs/core` (`@karmanto/core`) — общее без UI: адреса `PATHS` и `toRoutes`, `SITE`, `LOCALES`, хранилище
  `LocalStorage`, позже — метаданные.
- `libs/ui/<имя>` (`@karmanto/ui/<имя>`) — по библиотеке на UI-элемент (кнопки, шапка, футер…).
- `libs/<страница>/page` (`@karmanto/<страница>/page`) — по библиотеке на страницу; `index.ts` — `export default`
  компонента для `loadComponent`. В приложении — только конфиг и роуты.
- Адреса — только через `PATHS` из `@karmanto/core`, строки путей в коде не пишем.
- Библиотеке с `i18n`/`$localize` в тестах нужен `import '@angular/localize/init';` первой строкой `src/test-setup.ts`.
- Имя проекта = путь без `libs/`, алиас — `@karmanto/` + имя: `yarn nx g @nx/angular:library libs/home/page --name=home/page
--importPath=@karmanto/home/page`. Генератор кладёт компонент во вложенную папку — удалить его и создать
  компонент генератором компонента: `yarn nx g @nx/angular:component libs/home/page/src/lib/home-page --skipTests`.
- Импорт библиотек — только через алиас `@karmanto/…`. Тесты библиотек — `vitest-analog` у всех, с
  `passWithNoTests: true` в `vite.config.mts` (образец — `libs/core/vite.config.mts`).

## Команды

```sh
yarn start           # nx serve site — dev-сервер, только en
yarn build           # nx build site — все локали + 404.html
yarn serve           # nx serve-static site — собранная статика (404 — общий `404.html`)
yarn extract-i18n    # nx extract-i18n site
yarn test            # unit-тесты всех проектов
yarn lint            # линт всех проектов с --fix
yarn e2e             # Playwright по статике
yarn check           # lint test build e2e — задача готова, когда зелёный
yarn affected        # то же для затронутых проектов
yarn format          # Prettier
```

## Скиллы

- `.claude/skills/angular-developer` — официальный скилл Angular (`angular/skills`): справочник по сигналам,
  Signal Forms, роутингу, SSR/пререндеру, ARIA, тестам. Обновление: `npx skills update -p`; версия
  зафиксирована в `skills-lock.json`. Файлы скилла руками не править.
- `.claude/skills/update-vendors` — обновление зависимостей («обнови вендоры»): `nx migrate`, `ncu` с
  исключениями (Tailwind 3, vitest по peer `@angular/build`), проверки старых браузеров, PR в `main`.
- `.claude/skills/update-i18n` — обновление переводов («обнови переводы»): извлечь строки, добавить новые
  `trans-unit` с переводом в `messages.{ru,es}.xlf`, удалить устаревшие, проверить.
- Где скилл Angular расходится с правилами ниже — побеждают правила этого файла: вместо `ng generate`/`ng build` —
  генераторы и таргеты Nx (`yarn nx g …`, `yarn nx build site`), стили — Tailwind в шаблонах без файлов
  стилей у компонентов.

## Правила работы

- **Перед выполнением любой задачи — grill me.** Сначала расспроси владельца о неочевидных решениях
  (поведение, UX, тексты, крайние случаи), предложи варианты с рекомендацией; код — только после ответов.
  То, что уже решено в образце и не меняется в плане, не спрашивай — переноси.
- **Каждая задача — в отдельной ветке** от свежего `main`: `feature/<номер>-<кратко>` (`feature/1-workspace`),
  исправления — `fix/<кратко>`. В `main` — только через PR после зелёного CI, напрямую не коммитим. Перед мёржем
  ветку ребейзим на свежий `main` (`git rebase main`, `git push --force-with-lease`), мёрж — «Create a merge commit».
- Коммиты — `[тип] Кратко в повелительном наклонении` по-английски: `[feat] 2: Theme tokens`,
  `[fix] …`, `[refactor] …`, `[docs] …`, `[ci] …`, `[chore] …`.
- **Nx — только через генераторы** (`yarn nx g @nx/angular:library …`, `yarn nx g @nx/angular:component …`),
  сначала с `--dry-run`. Умолчания генераторов (префикс `km`, `OnPush`, без файлов стилей) — в `nx.json`.
- Библиотеки — в `libs/`, приложения — в `apps/`.
- Сигналы везде: `signal`, `computed`, `input()`, `output()`, `viewChild()`; без `@Input`/`@Output`/RxJS там,
  где хватает сигналов. API сверять с актуальной документацией angular.dev и nx.dev.
- Свои сигналы — с префиксом `$`: `readonly $open = signal(false)`, `$items = computed(…)`. Входы — с `$` и alias
  без него: `readonly $mode = input('text', { alias: 'mode' })`, в шаблоне `[mode]`. Без `$` — `output()` и поля,
  имена которых задаёт контракт (`FormValueControl`: `value`, `touched`, `disabled`…).
- Слушатели и привязки хоста — только в `host: {}`, без `@HostListener`/`@HostBinding`. Обработчики — `onX` по
  действию, без типа события: `onClose`, не `onCloseClick`. Состояния — классы `is-*` (`'[class.is-open]': '$open()'`).
- Кнопки и ссылки — атрибутные директивы на нативных элементах (`button[kmButton]`, `a[kmButton]`) с классами в
  `host`, без компонентов-обёрток.
- Пустые `imports: []` и `host: {}` не пишем. Зависимости — `inject()` в `private readonly` поля.
- Сервисы — `@Service()` (Angular 22), не `@Injectable({ providedIn: 'root' })`; подключаемые явно (`useClass`, `providers`)
  — `@Service({ autoProvided: false })`.
- Классы Tailwind — в шаблонах и `host: { class: '…' }`. У компонентов нет своих файлов стилей.
- Формы — Angular Signal Forms.
- `localStorage` напрямую не трогаем — только `inject(LocalStorage)` из `@karmanto/core`: не бросает, на сервере и без
  доступа к хранилищу работает в памяти. Ключи — `karmanto.consent`, `karmanto.theme`, `km-language-hint-closed`.
- Задача готова, когда `yarn check` (lint, test, build, e2e) зелёный; статус — в `docs/progress.md`.
- Принятые решения и отступления от плана — в `docs/decisions.md`.
- `README.md` — витрина на GitHub: сверху на английском дублирует тексты главной, ниже — раздел для разработчиков.
  Меняются тексты главной — обновлять README в той же задаче.
- На сайте не упоминаются цена, Pro и лимиты приложения.
- Не расширять объём задачи: то, что в плане помечено «Не входит», без явной просьбы не делаем.
- Юридические тексты (`content/`): черновики пишет агент один раз, в задаче 3, по прямой просьбе владельца. После
  этого — не писать, не генерировать и не править их без явной просьбы, даже опечатки, только сообщить. Никаких
  секретов в репозитории.
