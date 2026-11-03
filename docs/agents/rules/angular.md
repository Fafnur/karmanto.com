# Angular, Nx и устройство сайта

Все пути в этом документе — от корня репозитория.

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
- Юридические документы — `content/{en,ru,es}/{privacy,terms,consent}.md` → таргет `legal/content:content`
  (`tools/scripts/content.mjs`) → `libs/legal/content/src/generated/` (в `.gitignore`, собирается перед `site`).
  Якоря `##` — по английскому заголовку, число `##` во всех языках одинаковое; строка `TODO:` ломает сборку.
  Вывод — `prose` (`@tailwindcss/typography`, `target: 'legacy'`, тема под палитру в конфиге).
- Адаптивность — три разрешения на брейкпоинтах Tailwind, mobile-first: handset (< 768 px, без префикса),
  tablet (`md:`, 768–1023 px), web (`lg:`, ≥ 1024 px). e2e гоняются на всех трёх (Pixel 7, 820×1180, Desktop).
- Старые браузеры: синтаксис понижает сборка, недостающие API — точечные модули `core-js/stable/*` в
  `polyfills` (`apps/site/project.json`). Новый API в коде или в бандле Angular — добавить модуль туда.
  `.ts`-файл в `polyfills` не класть: Angular тогда считает приложение zone-based и ломает пререндер.
- Тесты: Vitest — в приложении через `@angular/build:unit-test`, в библиотеках через `@nx/vitest` + AnalogJS
  (`vitest-analog`, умолчание генератора); e2e — Playwright по собранной статике (`site:serve-static`
  на `http-server`), Chromium desktop, tablet и mobile.

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

## Правила кода

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

## Справочник Angular

Перед работой с Angular прочитай `.claude/skills/angular-developer/SKILL.md` и нужные справочные файлы по ссылкам из него.
Это внешний справочник `angular/skills`, доступный любому агенту как обычные файлы; путь сохранён для штатного обновления через `npx skills update -p`. Версия — в `skills-lock.json`, файлы руками не править.

При расхождении приоритет у правил проекта: вместо `ng generate`/`ng build` — генераторы и таргеты Nx (`yarn nx g …`, `yarn nx build site`); стили — Tailwind в шаблонах без файлов стилей у компонентов.
