'use strict';
process.env.NODE_ENV = 'product'

const electron = require('electron');
const main = require('electron-process').main;
const app = electron.app; // Module to control application life.
const BrowserWindow = electron.BrowserWindow; // Module to create native browser window.
//require('electron-reload')(__dirname);
const Menu = electron.Menu;
const shell = require('electron').shell;
var menu = Menu.buildFromTemplate([{
	label: '菜单',
	submenu: [{
			label: '启动擦亮器',
			click() {
			
			}
		},
		{ 
			type: 'separator'
		},
		{
			label: '主页',
			click() {
				shell.openExternal('http://www.ioliz.com')
			}
		},
		{
			label: '退出',
			click() {
				app.quit();
			}
		},
	]
}]);
//Menu.setApplicationMenu(menu);

let mainWindow = null;
//require('electron-debug')();
app.on('ready', function () {
	const backgroundURL = 'file://' + __dirname + '/public/background.html';
	var debug = false;
	const backgroundProcessHandler = main.createBackgroundProcess(backgroundURL,debug);
	mainWindow = new BrowserWindow({
		width: 1280,
		height: 600
	});
	backgroundProcessHandler.addWindow(mainWindow);
	mainWindow.loadURL('file://' + __dirname + '/public/index.html');
	//mainWindow.webContents.openDevTools();
	mainWindow.on('closed', onClosed);
});

function onClosed() {
	// Dereference the window
	// For multiple windows store them in an array
	mainWindow = null;
	app.quit();
}