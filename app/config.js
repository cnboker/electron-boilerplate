//production, development
//process.env.NODE_ENV = 'development'
process.env.REACT_APP_DOWNLOAD_URL = 'http://www.ioliz.com';
process.env.APP = 'electron';

if (process.env.NODE_ENV == 'production') {
    process.env.REACT_APP_API_URL = 'http://polish.ioliz.com/api';
    process.env.REACT_APP_AUTH_URL = 'http://polish.ioliz.com';
} else {
    process.env.REACT_APP_API_URL = 'http://localhost:3001/api';
    process.env.REACT_APP_AUTH_URL = 'http://localhost:3001';
}

var userHome = require('user-home');
var path = require('path');
//用户目录
process.env.Home = path.resolve(userHome, '.kwPolish');
//程序运行目录
process.env.AppRoot = process.cwd();