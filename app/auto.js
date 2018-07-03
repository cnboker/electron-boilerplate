var AutoLaunch = require('auto-launch');
var userHome = require('user-home');

var minecraftAutoLauncher = new AutoLaunch({
	name: '易优排名',
	//isHidden:true,
	path: `${userHome}/AppData/Local/Programs/app/易优排名.exe`,
});

minecraftAutoLauncher.enable();

//minecraftAutoLauncher.disable();

minecraftAutoLauncher.isEnabled()
.then(function(isEnabled){
	if(isEnabled){
	    return;
	}
	minecraftAutoLauncher.enable();
})
.catch(function(err){
    // handle error
});