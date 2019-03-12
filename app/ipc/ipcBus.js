//前端网页发数据给后端返回promise,由前端程序执行
/*
  var eventBus = new EvenBus();
  eventBus.frontToBack('createKeyword',{})
  .then((action)=>{
    console.log(action)
  })
  */
function frontToBack(event, payload) {
  sendToBackground(event, payload);
  var ipcRenderer = window.require("electron").ipcRenderer;
  return new Promise((resolve, reject) => {
    ipcRenderer.on(event, function(result) {
      resolve(result);
    });
  });
};

//后端发数据给前端返回,由后端程序执行
/*
    event:事件
    backgroundPromiseService:后台执行逻辑，参看backgroundProcess.js,执行完成返回给前端;
    backgroundPromiseService is promise
  */
function backToFront(event, backgroundPromiseService) {
  var ipc = require("electron").ipcRenderer;
  ipc.on(event, function(event, payload) {    
    backgroundPromiseService(event, payload).then(result => {
      sendToFront(event, result);
    });
  });
};



//后台发数据到前端页面
function sendToFront(eventName, payload) {
  try {
    if (!remote) return;
    var processHandler = remote.getGlobal("backgroundProcessHandler");
    processHandler.sendToAllForegroundWindows(eventName, payload);
  } catch (err) {
    //console.log(err);
  }
}

//前端网页发数据到后端程序
function sendToBackground(event, data) {
  if (!window.require) return;
  var processHandler = window
    .require("electron")
    .remote.getGlobal("backgroundProcessHandler");
  processHandler.sendToIPCRenderer(event, data);
}


module.exports = {
  frontToBack,
  backToFront
}