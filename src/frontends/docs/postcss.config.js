const purgecss = require('@fullhuman/postcss-purgecss');

const plugins = [
  require('postcss-omit-import-tilde'),
  require('postcss-import'),
  require('tailwindcss')('./tailwind.config.js'),
  require('autoprefixer'),
];

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
