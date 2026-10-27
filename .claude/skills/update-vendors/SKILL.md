---
name: update-vendors
description: Update all project dependencies (Nx, Angular, Yarn, npm packages, agent skills) to latest versions following a safe migration workflow, ending with a PR. Activate when user asks to "update vendors", "update dependencies", "обновить зависимости", "обновить вендоры".
---

# Update Vendors — karmanto.com

Goal: one branch `feature/vendors` with up to three commits, all checks green, a PR into `main`.
Never merge the PR yourself — merging (Create a merge commit) is the owner's job.

**Stop rule:** if any check fails at any step — **stop and report** the failing command and its output. Do not try
to "fix" failures by downgrading random packages or changing code without asking the owner first.

The full check used below (the Nx TUI is off in `nx.json`):

```bash
yarn nx run-many -t lint test build e2e
```

## Step 1: Check for uncommitted changes

```bash
git status --porcelain
```

If there are any uncommitted changes — **stop immediately** and tell the user to commit or stash them first.

## Step 2: Create feature branch from fresh main

```bash
git switch main
git pull --ff-only
git switch -c feature/vendors
```

If `feature/vendors` already exists locally or on `origin` — stop and ask the user what to do with it.

## Step 3: Update Yarn

```bash
npm view @yarnpkg/cli-dist version
```

If it is newer than `packageManager` in `package.json` — set `"packageManager": "yarn@<version>"` (edit the field,
keep the rest of `package.json` as is). `yarn -v` must then print the new version (Corepack picks it up).

## Step 4: Run Nx migration

```bash
yarn nx migrate latest
yarn install
```

This updates Nx, Angular, `typescript`, `angular-eslint` and related packages in `package.json` and may create
`migrations.json`.

## Step 5: Run Nx migrations (if migrations.json exists)

```bash
git status --porcelain migrations.json
```

If it is present — run the migrations, then delete the file (it is not kept in the repo):

```bash
yarn nx migrate --run-migrations=migrations.json
rm migrations.json
```

Read the migration output: if a migration reports something to do manually — tell the user.

## Step 6: Fix formatting

Nx migrations may reformat `project.json` and other files differently from Prettier config:

```bash
yarn nx format:write
```

## Step 7: Install Playwright browsers and run checks

The Playwright version may have changed — install the matching Chromium first:

```bash
yarn playwright install chromium
yarn nx run-many -t lint test build e2e
```

## Step 8: Commit Nx migration result

```bash
git status --porcelain
```

If there are changes:

```bash
git add -A
git commit -m "[vendors] Nx migrate"
```

Otherwise skip this commit.

## Step 9: Update remaining dependencies

Use `npm-check-updates` to update version strings in `package.json`, excluding packages managed elsewhere:

```bash
npx npm-check-updates@latest -u -p yarn \
  --reject 'nx,@nx/*,@angular/*,@angular-devkit/*,@schematics/angular,angular-eslint,typescript,tailwindcss,@types/node,vitest,@vitest/*,@analogjs/*'
```

Why these are excluded:

- **`nx`, `@nx/*`, `@angular/*`, `@angular-devkit/*`, `@schematics/angular`, `angular-eslint`, `typescript`, `@analogjs/*`**
  (library tests) — versions
  are chosen by `nx migrate` (Step 4) to be compatible with each other. `ncu` would jump to versions Nx does not
  support yet.
- **`tailwindcss`** — stays on `^3` (Tailwind v4 breaks the old browsers from `.browserslistrc`, see
  `docs/decisions.md`). Update within v3 only: `yarn up tailwindcss@^3`.
- **`@types/node`** — major must match the Node major in `.nvmrc`: `yarn up @types/node@^<major from .nvmrc>`.
- **`vitest`, `@vitest/*`** — unit tests run through `@angular/build:unit-test`, which pins a Vitest major in its
  peer dependencies. Use that range: `node -p 'require("@angular/build/package.json").peerDependencies.vitest'`, then
  `yarn up vitest@<range> @vitest/coverage-v8@<range>`.

Show the user the list of **major** upgrades `ncu` made (e.g. `eslint 9 → 10`) before continuing.

Then clean install:

```bash
rm -rf node_modules yarn.lock
yarn install
```

Check peer dependencies of the build tooling — a major bump from `ncu` must not fall outside them:

```bash
yarn explain peer-requirements | grep '✘ @karmanto/source@workspace:. provides'
```

Must print nothing (other `✘ … doesn't provide …` lines are pre-existing noise inside packages, ignore them). A line
like `provides vitest@npm:5.0.4 to @angular/build@npm:22.1.9` means a package from `package.json` is outside the
range its consumer requires (`yarn explain peer-requirements <hash>` shows the range). Revert that package to the highest version in the
required range (`yarn up <pkg>@<range>`) and tell the user.

## Step 10: Update agent skills

```bash
npx skills update -p -y
```

Updates `.claude/skills/angular-developer` and `skills-lock.json`. Do not edit skill files by hand.

## Step 11: Run checks after clean install

```bash
yarn playwright install chromium
yarn nx run-many -t lint test build e2e
yarn prettier --check .
```

## Step 12: Old browsers guard

The site must keep working in the old browsers from `.browserslistrc` (see `docs/decisions.md`).

1. **CSS** — the built stylesheet must not contain modern at-rules that old browsers drop entirely:

   ```bash
   grep -cE '@layer|@property|color-mix\(' dist/apps/site/browser/styles-*.css
   ```

   Must print `0`. Otherwise — stop and report (most likely Tailwind jumped a major).

2. **JS polyfills** — a new Angular version may start using newer APIs. Check the browser bundle for APIs newer
   than the polyfill list in `apps/site/project.json` (`polyfills`):

   ```bash
   grep -ohE 'Object\.(hasOwn|groupBy|fromEntries)|Promise\.(allSettled|any|withResolvers|try)|structuredClone|queueMicrotask|\.(findLast|findLastIndex|toSorted|toReversed|toSpliced|with|flatMap|flat|at|replaceAll|matchAll)\(|Iterator\.from|Set\.prototype\.(union|intersection)' dist/apps/site/browser/main-*.js | sort | uniq -c
   ```

   If an API appears that has no matching `core-js/stable/*` module in `polyfills` — tell the user and propose
   adding the module (do not add silently).

Note: Angular prints a warning about unsupported browsers during build — this is expected, ignore it.

## Step 13: Commit dependency updates

```bash
git status --porcelain
```

If there are changes:

```bash
git add -A
git commit -m "[vendors] Refresh dependencies"
```

Otherwise skip this commit.

## Step 14: Push and open PR

```bash
git log main..feature/vendors --oneline
```

If there are **no commits** — delete the branch and report that everything is already up to date:

```bash
git switch main
git branch -D feature/vendors
```

If there are commits — push and open a PR into `main`:

```bash
git push -u origin feature/vendors
gh pr create --base main --title "[vendors] Update dependencies" --body "<summary>"
```

PR body: Yarn/Nx/Angular versions before → after, list of major upgrades from Step 9, Nx migrations that ran,
any manual follow-ups, result of Step 12. Then wait for CI (`gh pr checks <number> --watch`) and report the PR link
and CI status to the user.
