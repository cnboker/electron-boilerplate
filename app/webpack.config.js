const path = require("path");
//const WriteFilePlugin =require('write-file-webpack-plugin');
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const WebpackShellPlugin = require("webpack-shell-plugin");
//const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const Dotenv = require("dotenv-webpack");

require("./config");

console.log("node_env=", process.env.NODE_ENV);

var mode = process.env.NODE_ENV || 'development'
//var mode = 'production'

var config = {
  mode: process.env.NODE_ENV || "development", //production or development
  devtool: "inline-source-map",
  performance: {
    hints: process.env.NODE_ENV !== "production" ? "warning" : false
  }
};

var imageLoaderConfig = {
  test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2)$/,
  loader: "url-loader",
  options: {
    limit: 102400
  }
}



var appConfig = Object.assign({}, config, {
  // TODO: Add common Configuration
  //target: 'electron-renderer',
  externals: ["electron"],
  target: process.env.APP === "web" ? "web" : "electron-renderer",
  entry: {
    app: ["babel-polyfill", "./src/index.js"]
  },
  output: {
    path: path.resolve(__dirname, "output"),
    filename: "app.bundle.js",
    publicPath: "/" //dev server required
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)?$/,
        //exclude: path.resolve(__dirname, "node_modules"),
        loader: "babel-loader",
        options: {
          presets: ["@babel/preset-env",
    "@babel/preset-react"] //stage-2 用于支持箭头函数
        }
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"]
      },
      {
        test: /\.txt$/i,
        use: 'raw-loader',
      },
      {
        test: /\.scss$/,
        use: [
          {
            loader: "style-loader" // creates style nodes from JS strings
          },
          {
            loader: "css-loader" // translates CSS into CommonJS
          },
          {
            loader: "sass-loader" // compiles Sass to CSS
          }
        ]
      },
      
      imageLoaderConfig
      
    ]
  },
  resolve: {
    extensions: ["*", ".js", ".jsx", ".css"]
  },
  devServer: {
    //contentBase: [path.join(__dirname,'/output/')],
    port: 3000,
    publicPath: "http://localhost:3000/index.html",
    historyApiFallback: true, //解决页面刷新404问题,
    compress: false,
    hot: true,
    inline:true,
    // 'Live-reloading' happens when you make changes to code
    // dependency pointed to by 'entry' parameter explained earlier.
    // To make live-reloading happen even when changes are made
    // to the static html pages in 'contentBase', add 
    // 'watchContentBase'
    watchContentBase: true,
  },
  plugins: [
    new WebpackShellPlugin({
      onBuildStart: ['echo "webpack start"'],
      onBuildEnd: ['echo "Webpack End"']
    }),
    new CleanWebpackPlugin(["dist", "output"]),
    new CopyWebpackPlugin([
      {
        from: "./public",
        to: "public",
        toType: "dir"
      }
    ]),
    new HtmlWebpackPlugin({
      hash: true,
      prefixApp: process.env.NODE_ENV === "production"? "1" : "vendors~app",
      template: "./public/index.html",
      inject: false, //fix "Error: only one instance of babel-polyfill is allowed"
      filename: "./index.html" //relative to root of the application
    }),
    new HtmlWebpackPlugin({
      hash: true,
      template: "./public/background.html",
      inject: false, //fix "Error: only one instance of babel-polyfill is allowed"
      filename: "./background.html" //relative to root of the application
    }),
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin(), //Hot Module Replacement enabled.
    new Dotenv({
      path: mode === "production"? "./.env.production": "./.env"
    })
    //new BundleAnalyzerPlugin()
  ],
  optimization: {
    minimize: process.env.NODE_ENV === "production",
    minimizer: [new UglifyJsPlugin({})],
    splitChunks: {
      //提高编译速度，HOTload不再重新编译vendors~app.app.bundle.js
      chunks: "all",
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true
        }
      }
    }
  }
});

var taskConfig = Object.assign({}, config, {
  externals: ["puppeteer"], //don't compile puppeteer
  target: "node", //resolve puppeteer build failure
  entry: {
    app: ["./tasks/scheduler.js"]
  },

  output: {
    path: path.resolve(__dirname, "output"),
    filename: "background.bundle.js",
    libraryTarget: "var",
    library: "PageJob"
  },
  plugins:[
    new Dotenv({
      path: mode === "production"? "./.env.production": "./.env"
    })
  ],
  optimization: {
    minimize: process.env.NODE_ENV === "production",
    minimizer: [new UglifyJsPlugin({})]
  }
});

var mainConfig = Object.assign({}, config, {
  target: "electron-renderer", //resolve puppeteer build failure
  entry: {
    app: ["./main.js"]
  },

  output: {
    path: path.resolve(__dirname, "output"),
    filename: "index.js"
  },

  optimization: {
    minimize: process.env.NODE_ENV === "production",
    minimizer: [new UglifyJsPlugin({})]
  },
  plugins: [
    new CopyWebpackPlugin([
      {
        from: "./assets",
        to: "assets",
        toType: "dir"
      }
    ]),
    new webpack.DefinePlugin({
      $dirname: "__dirname" //解决__dirname编译以后运行环境为/
    })
  ]
});

module.exports = [appConfig, taskConfig, mainConfig];
