
module.exports = {
	
	enableAuto: function () {
		var pjson = require('./package.json');
		var AutoLaunch = require('auto-launch');
		var minecraftAutoLauncher = new AutoLaunch({
			name: pjson.productName,
			//isHidden:true,
			path: (process.platform === 'darwin' ? `/Applications/${pjson.productName}.app` : `${process.env.ApplicationPath}\\${pjson.productName}.exe`),
		});

		minecraftAutoLauncher.enable();

		minecraftAutoLauncher.isEnabled()
			.then(function (isEnabled) {
				if (isEnabled) {
					return;
				}
				minecraftAutoLauncher.enable();
			})
			.catch(function (err) {
				// handle error
			});
	},
	getStateWindow: function (title, icon) {
	
		const electron = require('electron');
		const BrowserWindow = electron.BrowserWindow;

		var windowState = global.nodeStorage.getItem('windowstate') || {};
		var mainWindow = new BrowserWindow({
			webPreferences: {
				nodeIntegration: true
			  },
			title,
			icon,
			x: windowState.bounds && windowState.bounds.x || undefined,
			y: windowState.bounds && windowState.bounds.y || undefined,
			width: windowState.bounds && windowState.bounds.width || 1280,
			height: windowState.bounds && windowState.bounds.height || 640,
			show: false
		});
		mainWindow.setMenuBarVisibility(false)
		//fix White loading screens belong in browser
		mainWindow.on('ready-to-show', function () {
			//mainWindow.show();
			//mainWindow.focus();
		});

		// Restore maximised state if it is set. 
		// not possible via options so we do it here 
		if (windowState.isMaximized) {
			mainWindow.maximize();
		}

		if (windowState.isMinimized) {
			mainWindow.minimize();
		}

		// ['resize', 'move', 'close', 'minimize'].forEach(function (e) {
		// 	mainWindow.on(e, function () {
		// 		storeWindowState();
		// 	});
		// });

		// var storeWindowState = function () {
		// 	windowState.isMaximized = mainWindow.isMaximized();
		// 	windowState.isMinimized = mainWindow.isMinimized();
		// 	if (!windowState.isMaximized) {
		// 		// only update bounds if the window isn’t currently maximized    
		// 		windowState.bounds = mainWindow.getBounds();
		// 	}

		// 	global.nodeStorage.setItem('windowstate', windowState);
		// }
		return mainWindow;
	}
}