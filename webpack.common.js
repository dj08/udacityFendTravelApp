const path = require('path');
const webpack = require('webpack');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
    stats: {
	logging: 'verbose',
	colors: true,
    },
    entry: [
	// This is needed for babel to understand async/await
	'./node_modules/regenerator-runtime/runtime',
	'./src/client/index.js'
    ],
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
	    }
	]
    },
    plugins: [
	new HtmlWebPackPlugin({
	    template: './src/client/views/index.html',
	    filename: './index.html'
	}),
	new CleanWebpackPlugin({
	    verbose: true,
	    cleanStaleWebpackAssets: true,
	    protectWebpackAssets: false
	}),
    ],
};
