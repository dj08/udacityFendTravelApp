const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = merge(common, {
    mode: 'development',
    devtool: 'source-map',
    module: {
	rules: [
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
	new BundleAnalyzerPlugin()
    ],
};
