/* eslint-disable */
module.exports = {
  mode: 'jit',
  purge: {
    mode: 'layers',
    preserveHtmlElements: true,
    content: [
      './auth/app/**/*.html',
      './auth/app/**/*.ts',
      './auth/app/**/*.scss',
      './auth/index.html',
      './auth/styles.scss',
    ],
    options: {
      keyframes: false,
    },
  },
  theme: {
    extend: {},
  },
  variants: {},
  plugins: [],
};
