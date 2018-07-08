'use strict';
var path = require('path')
require('./config')
var logger = require('./logger')
const electron = require('electron');

const {
	autoUpdater
} = require("electron-updater");
//引用远程未注册模块
const main = require('./node_modules/electron-process/src/main');
var extender = require('./mainExtend')
extender.enableAuto();

const app = electron.app; // Module to control application life.
const BrowserWindow = electron.BrowserWindow; // Module to create native browser window.
//require('electron-reload')(__dirname);
const Menu = electron.Menu;
const shell = electron.shell;

let mainWindow = null;

autoUpdater.on('update-downloaded', (ev, info) => {
	// Wait 5 seconds, then quit and install
	// In your application, you don't need to wait 5 seconds.
	// You could call autoUpdater.quitAndInstall(); immediately
	setTimeout(function () {
		autoUpdater.quitAndInstall();
	}, 5000)
})

//require('electron-debug')();
app.on('ready', function () {
	const backgroundURL = 'file://' + $dirname + '/background.html';
	var debug = (process.env.NODE_ENV == 'development');

	const backgroundProcessHandler = main.createBackgroundProcess(backgroundURL, debug);
	// mainWindow = new BrowserWindow({
	// 	width: 1280,
	// 	height: 600,
	// 	icon: path.join($dirname, 'assets/icons/win/logo.png'),
	// 	show: false, 
	// 	//backgroundColor: '#002b36'
	// });
	// //fix White loading screens belong in browser
	// mainWindow.on('ready-to-show', function() { 
	// 	mainWindow.show(); 
	// 	mainWindow.focus(); 
	// });
	mainWindow = extender.getStateWindow('易优排名',path.join($dirname, 'assets/icons/win/logo.png'))
	
	const tray = new electron.Tray(path.join($dirname, 'assets/icons/win/logo.png'))
		

	tray.on('click', () => {
		mainWindow.isVisible() ? mainWindow.hide() : mainWindow.show()
	})

	mainWindow.on('show', () => {
		tray.setHighlightMode('always')
	})
	mainWindow.on('minimize', () => {
		mainWindow.hide();
	})
	mainWindow.on('hide', () => {
		tray.setHighlightMode('never')
	})

	backgroundProcessHandler.addWindow(mainWindow);
	mainWindow.loadURL('file://' + $dirname + '/index.html');

	if (process.env.NODE_ENV == 'development') {
		mainWindow.webContents.openDevTools();
	}

	mainWindow.on('closed', onClosed);

	logger.info('检测有无新版本');
	try {
		autoUpdater.checkForUpdates();
	} catch (e) {}

});

function sendStatusToWindow(text) {
	logger.info(text);
	if (mainWindow) {
		mainWindow.webContents.send('message', text);
	}
}
autoUpdater.on('checking-for-update', () => {
	sendStatusToWindow('检测更新...');
})
autoUpdater.on('update-available', (ev, info) => {
	sendStatusToWindow('有新版本啦.');
})
autoUpdater.on('update-not-available', (ev, info) => {
	sendStatusToWindow('当前为最新版本.');
})
autoUpdater.on('error', (ev, err) => {
	sendStatusToWindow('更新失败. ');
})
autoUpdater.on('download-progress', (ev, progressObj) => {
	sendStatusToWindow('正在下载...');
})
autoUpdater.on('update-downloaded', (ev, info) => {
	sendStatusToWindow('已下载完成; 马上重新安装');
});

function onClosed() {
	// Dereference the window
	// For multiple windows store them in an array
	mainWindow = null;
	app.quit();
}