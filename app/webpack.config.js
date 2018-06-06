const path = require('path');
const Dotenv = require('dotenv-webpack');
//const WriteFilePlugin =require('write-file-webpack-plugin');
const webpack = require('webpack');

var config = {
    // TODO: Add common Configuration
	module: {
		
	}
};

var appConfig = Object.assign({}, config, {
	mode: 'development', //production or development
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
					presets: ['env','react',"stage-2"] //stage-2 用于支持箭头函数
				}
			},
			{
				test: /\.css$/,
				use: ['style-loader', 'css-loader']
			}
		]
	},
	resolve: {
		extensions: ['*', '.js', '.jsx','.css']
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
		hot:true
	},
	plugins:[
    new webpack.HotModuleReplacementPlugin(),
		//new webpack.HotModuleReplacementPlugin(),
		//new WriteFilePlugin(),
		new Dotenv({
			path:'./.env'
		})
	]

});

var taskConfig = Object.assign({}, config,{
	mode: 'development', //production or development
	entry: {
		app: ['babel-polyfill', './src/tasks/scheduler.js']
	},

	output: {
		path: path.resolve(__dirname, 'bin'),
		filename: 'task.bundle.js'
	},node:
	{
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

