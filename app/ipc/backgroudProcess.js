/*
前端推送到后端事件后端处理逻辑,事件函数必须返回promise
*/
var handles = {
  'keyword_create': require('./createKeywordResponse'),
  'wordQuery':require('./wordQueryResponse')
}


module.exports = function () {
  var ipcBus = require('./ipcBus')
  Object
    .keys(handles)
    .map(x => {
      ipcBus.backToFront(x, handles[x])
    })
}