const path = require('path');
const Dotenv = require('dotenv-webpack');

module.exports = {
	mode: 'development', //production or development
	entry: {
		app: ['babel-polyfill', './src/index.js']
	},
	// node:{
	// 	fs:"empty"
	// },
	output: {
		path: path.resolve(__dirname, 'build'),
		filename: 'app.bundle.js'
	},
	module: {
		rules: [{
				test: /\.(js|jsx)?$/,
				exclude: /(node_modules|bower_components)/,
				loader: 'babel-loader',
				options: {
					presets: ['env']
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
		publicPath: "http://localhost:3000/build",
		historyApiFallback: true //解决页面刷新404问题
	},
	plugins:[
		new Dotenv({
			path:'./.env'
		})
	]

}
