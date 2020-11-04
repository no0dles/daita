const purgecss = require('@fullhuman/postcss-purgecss');
const CompressionPlugin = require('compression-webpack-plugin');

const postCssPlugins = [
  require('postcss-import'),
  require('tailwindcss')('./src/frontends/auth/tailwind.config.js'),
  require('autoprefixer'),
];

if (process.env.NODE_ENV === 'production') {
  postCssPlugins.push(
    purgecss({
      content: ['./src/frontends/auth/**/*.html', './src/frontends/auth/**/*.ts', './src/frontends/auth/**/*.scss'],
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
