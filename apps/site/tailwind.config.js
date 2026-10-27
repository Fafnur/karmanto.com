const { join } = require('node:path');
const typography = require('@tailwindcss/typography');

/** A theme color outside of utilities, e.g. in the `prose` theme. */
const color = (name) => `rgb(var(--color-${name}))`;

/**
 * Tailwind CSS v3: v4 relies on `@layer`, `@property` and `color-mix()` and breaks in the older browsers from `.browserslistrc`.
 * Picked up by `@angular/build` automatically (no PostCSS config needed).
 *
 * Design tokens mirror the app (`lib/core/theme/app_colors.dart`, palette «Sand»): colors are CSS variables of the light
 * and dark themes (`styles.scss`). Text colors are `ink-*` so that there is no `text-text-primary`.
 * Radii as in the app: buttons and fields 14 px, cards 18 px, large blocks and dialogs 24 px, pill — `rounded-full`.
 * The 4 px spacing grid is Tailwind's default scale.
 *
 * @type {import('tailwindcss').Config}
 */
module.exports = {
  content: [join(__dirname, 'src/**/*.{html,ts}'), join(__dirname, '../../libs/**/*.{html,ts}')],
  theme: {
    extend: {
      // Values are in `styles.scss` per theme; `rgba()` with a comma triplet works in old browsers, unlike `rgb(r g b / a)`.
      colors: Object.fromEntries(
        [
          ['background', 'background'],
          ['paper', 'paper'],
          ['outline', 'outline'],
          ['ink', 'text-primary'],
          ['ink-secondary', 'text-secondary'],
          ['ink-muted', 'text-muted'],
          ['primary', 'primary'],
          ['on-primary', 'on-primary'],
          ['primary-container', 'primary-container'],
          ['know', 'know'],
          ['again', 'again'],
          ['error', 'error'],
          ['on-error', 'on-error'],
        ].map(([name, variable]) => [name, `rgba(var(--color-${variable}), <alpha-value>)`]),
      ),
      fontFamily: {
        sans: ['"Noto Sans"', 'system-ui', '-apple-system', '"Segoe UI"', 'Roboto', 'sans-serif'],
      },
      borderRadius: {
        button: '14px',
        card: '18px',
        block: '24px',
      },
      boxShadow: {
        // Soft double shadow under paper, as `PaperCard` in the app.
        paper: '0 1px 2px var(--shadow), 0 8px 24px var(--shadow)',
      },
      typography: () => ({
        // `prose` for legal texts: palette of the site instead of Tailwind grays.
        DEFAULT: {
          css: {
            '--tw-prose-body': color('text-secondary'),
            '--tw-prose-headings': color('text-primary'),
            '--tw-prose-lead': color('text-secondary'),
            '--tw-prose-links': color('primary'),
            '--tw-prose-bold': color('text-primary'),
            '--tw-prose-counters': color('text-muted'),
            '--tw-prose-bullets': color('outline'),
            '--tw-prose-hr': color('outline'),
            '--tw-prose-quotes': color('text-primary'),
            '--tw-prose-quote-borders': color('primary'),
            '--tw-prose-captions': color('text-muted'),
            '--tw-prose-code': color('text-primary'),
            '--tw-prose-pre-code': color('text-primary'),
            '--tw-prose-pre-bg': color('paper'),
            '--tw-prose-th-borders': color('outline'),
            '--tw-prose-td-borders': color('outline'),
            'h1, h2, h3, h4': { fontWeight: '700' },
            // Direct links to `#section` (before hydration) stop below the sticky header.
            h2: { scrollMarginTop: '5.5rem' },
          },
        },
      }),
    },
  },
  corePlugins: {
    // Opacity variables produce `rgb(r g b / var(--tw-*-opacity))`, unsupported before Chrome 65. Use `bg-x/50` modifiers instead.
    backgroundOpacity: false,
    borderOpacity: false,
    divideOpacity: false,
    placeholderOpacity: false,
    ringOpacity: false,
    textOpacity: false,
  },
  // `legacy`: plain selectors instead of `:where()` (Chrome 88+).
  plugins: [typography({ target: 'legacy' })],
};
