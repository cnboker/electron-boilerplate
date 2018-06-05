'use strict';
// const setupEvents = require('./installers/setupEvents')
// if (setupEvents.handleSquirrelEvent()) {
// 	// squirrel event handled and app will exit in 1000ms, so don't do anything else
// 	return;
// }

// const electron = require('electron');

// const app = electron.app;
// const Menu = electron.Menu;

// // Adds debug features like hotkeys for triggering dev tools and reload
// //require('electron-debug')();

// // Prevent window being garbage collected
// let mainWindow;

// function onClosed() {
// 	// Dereference the window
// 	// For multiple windows store them in an array
// 	mainWindow = null;
// }

// function createMainWindow() {
// 	const win = new electron.BrowserWindow({
// 		width: 1280,
// 		height: 600
// 	});

// 	win.loadURL(`file://${__dirname}/public/index.html`);
// 	// Open the DevTools.
// 	//win.webContents.openDevTools()
// 	win.on('closed', onClosed);

// 	//create menu
// 	const shell = require('electron').shell;
// 	var menu = Menu.buildFromTemplate([{
// 		label: '菜单',
// 		submenu: [
// 			{
// 				label: '启动擦亮器',
// 				click(){
// 					require('./src/tasks/main')();
// 				}
// 			},
// 			{
// 				type: 'separator'
// 			},
// 			{
// 				label: '主页',
// 				click() {
// 					shell.openExternal('http://www.ioliz.com')
// 				}
// 			},
// 			{
// 				label: '退出',
// 				click() {
// 					app.quit();
// 				}
// 			},
// 		]
// 	}]);
// 	Menu.setApplicationMenu(menu);

// 	return win;
// }

// app.on('window-all-closed', () => {
// 	if (process.platform !== 'darwin') {
// 		app.quit();
// 	}
// });

// app.on('activate', () => {
// 	if (!mainWindow) {
// 		mainWindow = createMainWindow();
// 	}
// });

// app.on('ready', () => {
// 	mainWindow = createMainWindow();
// });
process.env.REACT_APP_API_URL = 'http://localhost:3001/api';
process.env.REACT_APP_AUTH_URL = 'http://localhost:3001';

console.log(process.env.REACT_APP_API_URL)

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
	var debug = true;
	const backgroundProcessHandler = main.createBackgroundProcess(backgroundURL,debug);
	mainWindow = new BrowserWindow({
		width: 1280,
		height: 600
	});
	backgroundProcessHandler.addWindow(mainWindow);
	mainWindow.loadURL('file://' + __dirname + '/public/index.html');
	mainWindow.webContents.openDevTools();
	mainWindow.on('closed', onClosed);
});

function onClosed() {
	// Dereference the window
	// For multiple windows store them in an array
	mainWindow = null;
	app.quit();
}