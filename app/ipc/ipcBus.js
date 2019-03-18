//前端网页发数据给后端返回promise,由前端程序执行
/*
  var eventBus = new EvenBus();
  eventBus.frontToBack('createKeyword',{})
  .then((action)=>{
    console.log(action)
  })
  */
function frontToBack(event, payload) {
  if(!isElectron())return;
  var ipcRenderer = window.require("electron").ipcRenderer;

  var promise= new Promise((resolve, reject) => {
    ipcRenderer.on(event, function(event, result) {
      resolve(result);
    });
  });
  sendToBackground(event, payload);
  return promise;
};

//后端发数据给前端返回,由后端程序执行
/*
    event:事件
    backgroundPromiseService:后台执行逻辑，参看backgroundProcess.js,执行完成返回给前端;
    backgroundPromiseService is promise
  */
function backToFront(key, backgroundPromiseService) {
  
  var ipcRenderer = window.require("electron").ipcRenderer;
  ipcRenderer.on(key, function(event, payload) {    
    
    backgroundPromiseService(key, payload).then(result => {
      sendToFront(key, result);
    });
  });
};



//后台发数据到前端页面
function sendToFront(eventName, payload) {
  if(!isElectron())return;
  try {
    //if (!remote) return;
    var processHandler = window
    .require("electron")
    .remote.getGlobal("backgroundProcessHandler");
    //var processHandler = remote.getGlobal("backgroundProcessHandler");
    processHandler.sendToAllForegroundWindows(eventName, payload);
  } catch (err) {
    console.log(err);
  }
}

//前端网页发数据到后端程序
function sendToBackground(event, data) {
  var processHandler = window
    .require("electron")
    .remote.getGlobal("backgroundProcessHandler");
  processHandler.sendToIPCRenderer(event, data);
}

function isElectron(){
  try{
    var userAgent = navigator.userAgent.toLowerCase();
    return userAgent.indexOf(' electron/') > -1
  }catch(e){
    return false;
  }
  
}

module.exports = {
  frontToBack,
  backToFront,
  sendToFront, //事件消息
  sendToBackground //事件消息
}