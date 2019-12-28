const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

// Port settings are stored in this file. They are shared with the
// express server this way.
const constants = require('./CONSTANTS');
const backendServer = `http://localhost:${constants.BACKEND_PORT}/`
module.exports = merge(common, {
    mode: 'development',
    devtool: 'source-map',
    devServer: {
	// webpack-dev-server setup
	host: 'localhost',
	port: constants.WEBPACK_DEV_PORT,
	proxy: {
	    // The frontend code uses the backend to store
	    // data. webpack-dev-server fails at this. Hence
	    // redirecting frontend api requests to a different port.
	    '/saveData' : {
		target: backendServer,
		secure: false
	    },
	    '/getData' : {
		target: backendServer,
		secure: false
	    }
	}
    },
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
});
