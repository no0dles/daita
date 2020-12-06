const purgecss = require('@fullhuman/postcss-purgecss');
const CompressionPlugin = require('compression-webpack-plugin');

const postCssPlugins = [
  require('postcss-omit-import-tilde'),
  require('postcss-import'),
  require('tailwindcss')('./src/frontends/docs/tailwind.config.js'),
  require('autoprefixer'),
];

if (process.env.NODE_ENV === 'production') {
  postCssPlugins.push(
    purgecss({
      content: ['./src/frontends/docs/**/*.html', './src/frontends/docs/**/*.ts', './src/frontends/docs/**/*.scss'],
      safelist: [/^:host/],
      defaultExtractor: (content) => content.match(/[\w-/:]+(?<!:)/g) || [],
    }),
  );
}

module.exports = {
  plugins: [new CompressionPlugin()],
  module: {
    rules: [
      {
        test: /\.scss$/,
        loader: 'postcss-loader',
        options: {
          ident: 'postcss',
          syntax: 'postcss-scss',
          plugins: () => postCssPlugins,
        },
      },
    ],
  },
};
