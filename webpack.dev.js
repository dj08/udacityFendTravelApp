const path = require('path');
const webpack = require('webpack');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
    mode: 'development',
    devtool: 'source-map',
    stats: {
	logging: 'verbose',
	colors: true,
    },
    entry: './src/client/index.js',
    output: {
	libraryTarget: 'var',
	library: 'Client'
    },
    module: {
	rules: [
	    {
		// Run all custom JS in project through
		// babel. Otherwise webpack will move advanced ES
		// syntaxes to browser distribution and will create
		// issues there.
		test: /\.js$/,
		exclude: /node_modules/,
		loader: "babel-loader"
	    },
	    {
		enforce: 'pre', // This comes before babel-loader
		test: /.js$/,
		exclude: /node_modules/,
		loader: 'eslint-loader',
		options: {}
	    },
	    {
		test: /\.scss$/,
		use: [ 'style-loader', 'css-loader', 'sass-loader' ]
	    }
	]
    },
    plugins: [
	new HtmlWebPackPlugin({
	    template: './src/client/views/index.html',
	    filename: './index.html'
	}),
	new CleanWebpackPlugin({
	    dry: true,
	    verbose: true,
	    cleanStaleWebpackAssets: true,
	    protectWebpackAssets: false
	}),
	new BundleAnalyzerPlugin(),
    ],
};
