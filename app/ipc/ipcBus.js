//前端网页发数据给后端返回promise
/*
  var eventBus = new EvenBus();
  eventBus.frontToBack('createKeyword',{})
  .then((action)=>{
    console.log(action)
  })
  */
module.exports = frontToBack(event, payload) {
  this.sendToBackground(event, payload)
  var ipcRenderer = window
    .require("electron")
    .ipcRenderer;
  return new Promise((resolve, reject) => {
    ipcRenderer
      .on(event, function (event, result) {
        resolve(result)
      })
  })
}
//后端发数据给前端返回
/*
    event:事件
    func:后台执行逻辑，执行完成返回给前端;func as promise
  */
module.exports = backToFront(event, func) {
  var ipc = require('electron').ipcRenderer;
  var self = this;
  ipc.on(event, function (event, payload) {
    func(event, payload).then(result => {
      self.sendToFront(event, result)
    })
  });
}

//后台发数据到前端页面
function sendToFront(eventName, payload) {
  try {
    if (!remote) 
      return;
    var processHandler = remote.getGlobal("backgroundProcessHandler");
    processHandler.sendToAllForegroundWindows(eventName, payload);
  } catch (err) {
    //console.log(err);
  }
};

//前端网页发数据到后端程序
function sendToBackground(event, data) {
  if (!window.require) 
    return;
  var processHandler = window
    .require("electron")
    .remote
    .getGlobal("backgroundProcessHandler");
  processHandler.sendToIPCRenderer(event, data);
}
