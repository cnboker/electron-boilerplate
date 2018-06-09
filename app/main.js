'use strict';

require('./config')

const electron = require('electron');

//引用远程未注册模块
const main = require('./node_modules/electron-process/src/main');

const app = electron.app; // Module to control application life.
const BrowserWindow = electron.BrowserWindow; // Module to create native browser window.
//require('electron-reload')(__dirname);
const Menu = electron.Menu;
const shell = require('electron').shell;


let mainWindow = null;
//require('electron-debug')();
app.on('ready', function () {
	const backgroundURL = 'file://' + __dirname + '/public/background.html';
	var debug = (process.env.NODE_ENV == 'development');
	
	const backgroundProcessHandler = main.createBackgroundProcess(backgroundURL,debug);
	mainWindow = new BrowserWindow({
		width: 1280,
		height: 600
	});
	backgroundProcessHandler.addWindow(mainWindow);
	mainWindow.loadURL('file://' + __dirname + '/public/index.html');
	if(process.env.NODE_ENV == 'development'){
		mainWindow.webContents.openDevTools();
	}
	
	mainWindow.on('closed', onClosed);
});

function onClosed() {
	// Dereference the window
	// For multiple windows store them in an array
	mainWindow = null;
	app.quit();
}