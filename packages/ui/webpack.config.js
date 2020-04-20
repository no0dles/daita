const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    mode: 'production',
    entry: {
        // home: './src/pages/home/home.ts',
        // about: './src/pages/about/about.ts',
        // styles: './src/styles.scss',

        bundle: ['./src/main.js']
    },
    //devtool: 'inline-source-map',
    module: {
        rules: [
            // {
            //     test: /\.tsx?$/,
            //     use: 'ts-loader',
            //     exclude: /node_modules/,
            // },
            // {
            //     test: /\.(html)$/,
            //     use: [{
            //         loader: 'html-loader',
            //         options: {
            //             attrs: false,
            //         },
            //     }, {
            //         loader: path.resolve('./daita-loader.js'),
            //     }],
            // },
            // {
            //     test: /\.scss$/i,
            //     use: [
            //         'style-loader',
            //         'css-loader',
            //         'sass-loader',
            //     ],
            // },

            {
                test: /\.svelte$/,
                use: {
                    loader: 'svelte-loader',
                    options: {
                        emitCss: true,
                        hotReload: true
                    }
                }
            },
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader'
                ]
            },
        ],
    },
    resolve: {
        alias: {
            svelte: path.resolve('node_modules', 'svelte')
        },
        extensions: ['.tsx', '.ts', '.js', '.svelte'],
        mainFields: ['svelte', 'browser', 'module', 'main']
    },
    output: {
        path: path.join(__dirname, 'dist'),
        //filename: '[name].bundle.js',
        // chunkFilename: '[name].[chunkhash].bundle.js',
        // publicPath: '/',
        filename: '[name].js',
        chunkFilename: '[name].[id].js'
    },
    performance: {hints: false},
    // optimization: {
    //     runtimeChunk: 'single',
    //     splitChunks: {
    //         chunks: 'all',
    //         cacheGroups: {
    //             vendor: {
    //                 test: /[\\/]node_modules[\\/]/,
    //                 name: 'vendors',
    //             },
    //         },
    //     },
    // },
    plugins: [
        // new HtmlWebpackPlugin({
        //     inject: true,
        //     filename: 'home.html',
        //     template: 'src/pages/home/home.html',
        //     chunks: ['home', 'styles'],
        // }),
        // new HtmlWebpackPlugin({
        //     inject: true,
        //     filename: 'about.html',
        //     template: 'src/pages/about/about.html',
        //     chunks: ['about', 'styles'],
        // }),
    ],
};