module.exports = {
  purge: {
    enabled: true,
    content: ['./src/**/*.html', './src/**/*.ts', './src/**/*.scss'],
  },
  theme: {
    extend: {},
  },
  variants: {},
  plugins: [
    require('@tailwindcss/ui')({
      layout: 'sidebar',
    }),
  ],
};
