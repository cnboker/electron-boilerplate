var AutoLaunch = require('auto-launch');

var minecraftAutoLauncher = new AutoLaunch({
	name: 'kwPolish',
	//path: '/Applications/kwPolish.app',
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