var jobContext = require('./jobContext')
var scanJober = require('./scanJober');
var polishJober = require('./polishJober')

var socket = require('socket.io-client')(process.env.REACT_APP_API_URL)
socket.on('connect', function () {
  console.log('connect')
})

socket.on('event', function (data) {
  console.log('event...')
})

socket.on('disconnect', function () {
  console.log('disconnect')
})

//pause the keyword polish
socket.on('keyword_pause', function (data) {
  jobContext.removeById(data._id)
})

//clean the keyword polish
socket.on('keyword_clean', function (data) {
  jobContext.clean();
  socket.emit('finished)
});

socket.on('keyword_scan', function (data) {
  jobContext.clean();
  scanJober.itemsPush(data)
  socket.emit('finished')
})

socket.on('keyword_polish',function(data){
  jobContext.clean();
  polishJober.itemsPush(data);
  socket.emit('finished')
})