process.env.REACT_APP_DOWNLOAD_URL = 'http://www.ioliz.com';
//process.env.APP = 'electron';
console.log('process.env.APP', process.env.APP)

if (process.env.NODE_ENV == 'production') {
   process.env.REACT_APP_API_URL = 'http://polish.ioliz.com/api';
   process.env.REACT_APP_AUTH_URL = 'http://polish.ioliz.com';
 
} else {
    process.env.REACT_APP_API_URL = 'http://localhost:3001/api';
    process.env.REACT_APP_AUTH_URL = 'http://localhost:3001';
}

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

let currentPath = process.cwd();
var envData = global.nodeStorage.getItem('env');
if (envData) {
    console.log(envData)
    currentPath = envData.cwd;
   // console.log('read stroe',currentPath)
} else {
    //save env
    //因为系统自启动后process.cwd()指向c:/windows目录, 所以这里需要保持该数据
    let env = {};
    env.cwd = currentPath;
    global.nodeStorage.setItem('env', env);
    //---------------------------------------------------------------------------
}
process.env.ApplicationPath = currentPath
//程序运行目录
process.env.PUPPETEER_SKIP_CHROMIUM_DOWNLOAD = true;
// var appRoot = path.join(process.cwd(),'resources','app');
// process.env.ChromePath = path.join(appRoot, 'output', 'node_modules','puppeteer',
//     '.local-chromium', 'win64-564778', 'chrome-win32', 'chrome.exe');
var appRoot = path.join(currentPath, 'resources');
process.env.ChromePath = path.join(appRoot, 'node_modules', 'puppeteer',
    '.local-chromium', 'win64-564778', 'chrome-win32', 'chrome.exe');
