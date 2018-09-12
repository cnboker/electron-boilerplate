module.exports = function(eventName, payload) {
  try {
    var processHandler = remote.getGlobal("backgroundProcessHandler");
    processHandler.sendToAllForegroundWindows(eventName, payload);
  } catch (err) {
    console.log(err);
  }
};
