const { join } = require('node:path');

/**
 * Tailwind CSS v3: v4 relies on `@layer`, `@property` and `color-mix()` and breaks in the older browsers from `.browserslistrc`.
 * Picked up by `@angular/build` automatically (no PostCSS config needed). Design tokens — task 2.
 *
 * @type {import('tailwindcss').Config}
 */
module.exports = {
  content: [join(__dirname, 'src/**/*.{html,ts}'), join(__dirname, '../../libs/**/*.{html,ts}')],
  theme: {
    extend: {},
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
};
