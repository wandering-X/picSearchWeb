var path = require('path')
var webpack = require('webpack')
var htmlWebpackPlugin = require('html-webpack-plugin')
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var rimraf = require("rimraf");


var ENV = process.env.npm_lifecycle_event;
var isServer = ENV === 'server';
var isDev = ENV === 'dev';

// isDev && rimraf.sync('./dist/');

module.exports = {
    entry: {
        app: './src/entry.js',
        vendor: "angular"
    },
    output: {
        path: __dirname + '/dist/',
        publicPath: isDev ? "/" : 'http://localhost:8080/',
        filename: 'js/[name].[hash].js',
        // chunkFilename: '[name].[hash].js'
    },
    module: {
        loaders: [
            // { test: /\.css$/, loader: 'style-loader!css-loader' },
            {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract({
                    fallbackLoader: 'style-loader',
                    loader: [{loader: 'css-loader'}]
                })
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/
            },
            {
                test: /\.(png|jpg)$/,
                loader: 'file-loader?name=images/[hash:8].[name].[ext]'
            },
            {
                test: /\.html$/,
                loader:"html-loader?attrs=link:href img:src"
            },
        ]
    },
    plugins:[
        new htmlWebpackPlugin({
            template: './src/pages/index.html',
            inject: 'body',
            minify: {
                removeComments: true,
                collapseWhitespace: true
            }
        }),
        new webpack.optimize.CommonsChunkPlugin({
            names: ['vendor', 'manifest']
        }),
        new ExtractTextPlugin({
            filename: 'styles/[name].[chunkhash].css',
            allChunks: true
        }),
    ],
    devServer: {
        contentBase: './src',
        stats: 'minimal'
    }
}