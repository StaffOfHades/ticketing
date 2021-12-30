const { createGlobPatternsForDependencies } = require('@nrwl/next/tailwind');
const defaultTheme = require('tailwindcss/defaultTheme')
const { join } = require('path');

module.exports = {
  mode: 'jit',
  presets: [require('../../tailwind-preset.base.js')],
  content: [
    join(__dirname, '{components,hooks,pages}/**/*.{js,ts,jsx,tsx}'),
    ...createGlobPatternsForDependencies(__dirname),
  ],
  variants: {
    extend: {},
  },
}
