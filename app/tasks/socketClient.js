var jobContext = require('./jobContext')
var scanJober = require('./scanJober');
var polishJober = require('./polishJober')
const auth = require('../auth')
const logger = require('../logger')
//open debug info
localStorage.debug = '*';
var access_token = auth.getToken();
var io = require('socket.io-client');
//require add namespace 'task' otherwise not connect
var socket = io.connect(`${process.env.REACT_APP_API_URL}/task?token=${access_token}`,{'force new connection': true})
socket.on('connect', function () {
  logger.info('connect')
})
socket.send('hello world')

socket.on('event', function (data) {
  console.log('event...')
})
socket.on('currentStatus', function (data){ console.log(data) });
socket.on('disconnect', function () {
  logger.info('disconnect')
})

//pause the keyword polish
socket.on('keyword_pause', function (data) {
  logger.info('keyword_pause start...')
  jobContext.removeById(data._id)
})
socket.on('error', function (data) {
  logger.info(data || 'error');
});

socket.on('connect_failed', function (data) {
  logger.info(data || 'connect_failed');
});
//clean the keyword polish
socket.on('keyword_clean', function (data) {
  jobContext.clean();
  socket.emit('finished')
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