/*
前端接收到后端事件处理逻辑,由后端主动发起的逻辑事件处理， 比如系统启动后处理为没有初始排名的数据，远程POLISH完成的数据通知等
*/
import { receiveKeyword } from "~/src/Keyword/index/actions/keywords_actions";

export default function(dispatch) {
  if (!window.require) return;
  var ipcRenderer = window.require("electron").ipcRenderer;

  ipcRenderer.on("keyword_update", function(event, payload) {
    console.log('ipc keyword_update',payload)
    dispatch(receiveKeyword(payload));
  });

  ipcRenderer.on("message", function(event, text) {
    var container = document.getElementById("__messages");
    if (container) {
      container.innerHTML = text;
    }
  });

};
