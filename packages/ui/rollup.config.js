import html from '@rollup/plugin-html';
import multi from '@rollup/plugin-multi-entry';
import typescript from '@rollup/plugin-typescript';

module.exports = {
    input: [
        './src/pages/home/home.ts',
        './src/pages/about/about.ts'
    ],
    output: {
        dir: 'dist'
    },
    plugins: [html(), multi(), typescript()]
};