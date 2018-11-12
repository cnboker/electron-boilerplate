//handle background event data
export function eventRegister() {
  if (!window.require) return;
  var EventBus = require("eventing-bus");

  var ipcRenderer = window.require("electron").ipcRenderer;

  ipcRenderer.on("message", function(event, text) {
    // changes the text of the button
    var container = document.getElementById("__messages");
    if (container) {
      container.innerHTML = text;
    }
  });

  //重新加载页面数据
  ipcRenderer.on("pageRefresh", function() {
    console.log("pageRefresh message");
    var refreshButton = document.getElementById("pageRefresh");
    if (refreshButton) {
      refreshButton.click();
    }
  });

  //拓词前端接收数据
  ipcRenderer.on("wordResponse", function(event, result) {
    console.log("wordResponse", result);
    EventBus.publish("wordResponse", result);
  });
}

export function sendToBackground(event, data) {
  if (!window.require) return;
  var processHandler = window
    .require("electron")
    .remote.getGlobal("backgroundProcessHandler");
  processHandler.sendToIPCRenderer(event, data);
}
