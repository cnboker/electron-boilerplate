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


var path = require('path');
//用户目录
process.env.Home = path.resolve((process.platform === 'win32') ? process.env.HOMEPATH : process.env.HOME, '.kwPolish');
//程序运行目录
//process.env.AppRoot = process.cwd();
process.env.PUPPETEER_SKIP_CHROMIUM_DOWNLOAD = true;
process.env.ChromePath = path.join(process.env.Home, 'puppeteer',
    '.local-chromium', 'win64-555668', 'chrome-win32', 'chrome.exe');