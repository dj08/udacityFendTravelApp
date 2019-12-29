const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
// Service workers added in prod to allow offline access.
const WorkboxPlugin = require('workbox-webpack-plugin');

module.exports = merge(common, {
    mode: 'production',
    optimization: {
	minimizer: [new TerserPlugin(), new OptimizeCssAssetsPlugin()]
    },
    module: {
	rules: [
	    {
		// We use the loader supplied by plugin instead of
		// style-loader here. This enables putting the styles
		// as a stylesheet in the HTML, as opposed to styles
		// done via JS in case of style-loader.
		test: /\.s[ac]ss$/,
		use: [ MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader' ]
	    }
	]
    },
    plugins: [
	new MiniCssExtractPlugin({filename: '[name].css'}),
	new WorkboxPlugin.GenerateSW(),
    ]
});
