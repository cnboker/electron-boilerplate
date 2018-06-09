const path = require('path');
const Dotenv = require('dotenv-webpack');
//const WriteFilePlugin =require('write-file-webpack-plugin');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
require('./config')

var config = {
	// TODO: Add common Configuration
	module: {

	}
};

var appConfig = Object.assign({}, config, {
	mode: process.env.NODE_ENV, //production or development
	devtool: (process.env.NODE_ENV === 'development') ? 'inline-source-map' : false,
	entry: {
		app: ['babel-polyfill', './src/index.js']
	},
	output: {
		path: path.resolve(__dirname, 'public'),
		filename: 'app.bundle.js'
	},
	module: {
		rules: [{
				test: /\.(js|jsx)?$/,
				exclude: /(node_modules|bower_components)/,
				loader: 'babel-loader',
				options: {
					presets: ['env', 'react', "stage-2"] //stage-2 用于支持箭头函数
				},
			},
			{
				test: /\.css$/,
				use: ['style-loader', 'css-loader']
			},
			{
				test: /\.(png|jpg)$/,
				loader: 'url-loader'
			}
		]
	},
	resolve: {
		extensions: ['*', '.js', '.jsx', '.css']
	},
	performance: {
		hints: process.env.NODE_ENV === 'production' ? "warning" : false
	},
	devServer: {
		contentBase: path.join(__dirname, 'public'),
		port: 3000,
		publicPath: "http://localhost:3000/public",
		historyApiFallback: true, //解决页面刷新404问题,
		compress: false,
		hot: true
	},
	plugins: [
		new CleanWebpackPlugin(['dist']),
		new HtmlWebpackPlugin({
			hash: true,
			publicDir: process.env.APP === 'web' ? "public/" : "",
			template: './assets/template/index.html',
			inject: false, //fix "Error: only one instance of babel-polyfill is allowed"
            filename: './index.html' //relative to root of the application
		}),
		new webpack.NamedModulesPlugin(),
		new webpack.HotModuleReplacementPlugin(),
		new Dotenv({
			path: './.env'
		})
	]

});

var taskConfig = Object.assign({}, config, {
	mode: 'development', //production or development
	entry: {
		app: ['babel-polyfill', './src/tasks/scheduler.js']
	},

	output: {
		path: path.resolve(__dirname, 'bin'),
		filename: 'task.bundle.js'
	},
	node: {
		"child_process": "empty",
		"fs": "empty",
		"net": "empty",
		"readline": "empty",
		"tls": "empty"
	}
});

// Return Array of Configurations
module.exports = [
	appConfig
];