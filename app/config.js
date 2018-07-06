//production, development
//process.env.NODE_ENV = 'development'
process.env.REACT_APP_DOWNLOAD_URL = 'http://www.ioliz.com';
process.env.APP = 'electron';


var userHome = require('user-home');
var path = require('path');
//用户目录
process.env.Home = path.resolve(userHome, '.kwPolish');
//程序运行目录
process.env.AppRoot = process.cwd();