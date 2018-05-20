const path = require('path');

module.exports = {
	mode: 'production', //production or development
	entry: {
		app: ['babel-polyfill', './src/index.js']
	},
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
		extensions: ['*', '.js', '.jsx']
	},
	performance: {
		hints: process.env.NODE_ENV === 'production' ? "warning" : false
	},
	devServer: {
		contentBase: path.join(__dirname, 'public'),
		port: 3000,
		publicPath: "http://localhost:3000/build"
	}

}
