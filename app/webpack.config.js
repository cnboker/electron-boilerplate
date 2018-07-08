const path = require('path');
const Dotenv = require('dotenv-webpack');
//const WriteFilePlugin =require('write-file-webpack-plugin');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin')

require('./config')
console.log('node_env=',process.env.NODE_ENV)
var config = {
	mode: process.env.NODE_ENV, //production or development
	devtool: 'source-map',
	performance: {
		hints: process.env.NODE_ENV !== 'production' ? "warning" : false
	}
};

var appConfig = Object.assign({}, config, {


	// TODO: Add common Configuration
	target: 'electron-renderer',

	entry: {
		app: ['babel-polyfill', './src/index.js'],
	},
	output: {
		path: path.resolve(__dirname, 'output'),
		filename: 'app.bundle.js'
	},
	module: {
		rules: [{
				test: /\.(js|jsx)?$/,
				//exclude: path.resolve(__dirname, "node_modules"),
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
				test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2)$/,
				loader: 'url-loader',
				options: {
					limit: 10000
				}
			}
		]

	},
	resolve: {
		extensions: ['*', '.js', '.jsx', '.css']
	},
	devServer: {
		contentBase: path.join(__dirname, 'output'),
		port: 3000,
		publicPath: "http://localhost:3000/background.html",
		historyApiFallback: true, //解决页面刷新404问题,
		compress: false,
		hot: true
	},
	plugins: [
		new CleanWebpackPlugin(['dist', 'output']),
		new HtmlWebpackPlugin({
			hash: true,
			publicDir: process.env.APP === 'web' ? "public/" : "",
			template: './public/index.html',
			inject: false, //fix "Error: only one instance of babel-polyfill is allowed"
			filename: './index.html' //relative to root of the application
		}),
		new HtmlWebpackPlugin({
			hash: true,
			publicDir: process.env.APP === 'web' ? "public/" : "",
			template: './public/background.html',
			inject: false, //fix "Error: only one instance of babel-polyfill is allowed"
			filename: './background.html' //relative to root of the application
		}),
		new webpack.NamedModulesPlugin(),
		new webpack.HotModuleReplacementPlugin(),

		// new Dotenv({
		// 	path: './.env'
		// })
	],
	optimization: {
		minimize: process.env.NODE_ENV === 'production',
		minimizer: [new UglifyJsPlugin({})]
	}

});


var taskConfig = Object.assign({}, config, {
	target: 'node', //resolve puppeteer build failure 
	entry: {
		app: ['./tasks/main.js']
	},

	output: {
		path: path.resolve(__dirname, 'output'),
		filename: 'background.bundle.js'
	},

	optimization: {
		minimize: process.env.NODE_ENV === 'production',
		minimizer: [new UglifyJsPlugin({})]
	}
});

var mainConfig = Object.assign({}, config, {
	target: 'electron-renderer', //resolve puppeteer build failure 
	entry: {
		app: ['./main.js']
	},

	output: {
		path: path.resolve(__dirname, 'output'),
		filename: 'index.js'
	},

	optimization: {
		minimize: process.env.NODE_ENV === 'production',
		minimizer: [new UglifyJsPlugin({})]
	},
	plugins: [
		new CopyWebpackPlugin([{
			from: './assets',
			to: 'assets',
			toType: 'dir'
		}]),
		new webpack.DefinePlugin({
			$dirname: '__dirname', //解决__dirname编译以后运行环境为/
		})
	]
});

// Return Array of Configurations
module.exports = [
	appConfig, taskConfig, mainConfig

];