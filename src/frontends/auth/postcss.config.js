/* eslint-disable */
const purgecss = require('@fullhuman/postcss-purgecss');

const plugins = [require('tailwindcss')('./tailwind.config.js')];

if (process.env.NODE_ENV === 'production') {
  plugins.push(
    purgecss({
      content: ['./**/*.html', './**/*.ts', './**/*.scss'],
      safelist: [/^:host/],
      defaultExtractor: (content) => content.match(/[\w-/:]+(?<!:)/g) || [],
    }),
  );
}

module.exports = {
  plugins,
};
