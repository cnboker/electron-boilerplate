module.exports = function(eventName, payload) {
  try {
    if(!remote)return;
    var processHandler = remote.getGlobal("backgroundProcessHandler");
    processHandler.sendToAllForegroundWindows(eventName, payload);
  } catch (err) {
    //console.log(err);
  }
};
