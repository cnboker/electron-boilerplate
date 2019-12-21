
process.env.REACT_APP_DOWNLOAD_URL = 'http://www.kwPolish.com';


//require('axios').defaults.maxRedirects = 0;

var path = require('path');

var homeDir = process.platform === 'darwin' ? process.env.HOME : process.env.LOCALAPPDATA;
//用户目录
process.env.AppHome = path.join(homeDir, '.kwPolish');

//set localStorage
var fs = require('fs')
if (!fs.existsSync(process.env.AppHome)) {
    fs.mkdirSync(process.env.AppHome)
}
var JSONStorage = require('node-localstorage').JSONStorage;
var storageLocation = path.join(process.env.AppHome, 'appData');
if (!fs.existsSync(storageLocation)) {
    fs.mkdirSync(storageLocation)
}
global.nodeStorage = new JSONStorage(storageLocation);


//程序运行目录
process.env.PUPPETEER_SKIP_CHROMIUM_DOWNLOAD = true;
// var appRoot = path.join(process.cwd(),'resources','app');
// process.env.ChromePath = path.join(appRoot, 'output', 'node_modules','puppeteer',
//     '.local-chromium', 'win64-564778', 'chrome-win32', 'chrome.exe');
if(process.platform === 'darwin'){
    process.env.ApplicationPath = path.join(process.env.HOME,'KwPolish');
}else{
    process.env.ApplicationPath = path.join(process.env.LOCALAPPDATA,'Programs','App');
}
console.log('apppath',process.env.ApplicationPath)

var appRoot = path.join(process.env.ApplicationPath, 'resources');

process.env.ChromePath = path.join(appRoot, 'node_modules', 'puppeteer',
    '.local-chromium', `win32-564778`, 'chrome-win32', 'chrome.exe');

