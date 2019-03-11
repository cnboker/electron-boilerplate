/*
前端推送到后端事件后端处理逻辑
*/
var handles = {
  'keyword_create': require('./createKeywordResponse'),
  'wordQuery':require('./wordQueryResponse')
}

module.exports = function (event,payload) {
  var ipcBus = require('./ipcBus')
  Object
    .keys(handles)
    .map(x => {
      ipcBus.backToFront(x, handles[x])
    })
}