const purgecss = require('@fullhuman/postcss-purgecss');
const CompressionPlugin = require('compression-webpack-plugin');

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
          plugins: () => [
            require('postcss-import'),
            require('tailwindcss')('./src/frontends/auth/tailwind.config.js'),
            require('autoprefixer'),
            purgecss({
              content: [
                './src/frontends/auth/**/*.html',
                './src/frontends/auth/**/*.ts',
                './src/frontends/auth/**/*.scss',
              ],
              safelist: [/^:host/],
              defaultExtractor: (content) => content.match(/[\w-/:]+(?<!:)/g) || [],
            }),
          ],
        },
      },
    ],
  },
};
