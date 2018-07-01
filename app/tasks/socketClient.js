var jobContext = require('./jobContext')
var scanJober = require('./scanJober');
var polishJober = require('./polishJober')
const auth = require('../auth')
const logger = require('../logger')
//open debug info
if (process.env.APP == 'electron') {
  localStorage.debug = '*';
}

var token = auth.getToken();
var io = require('socket.io-client');
//console.log(process.env.REACT_APP_API_URL)
//require add namespace 'task' otherwise not connect
var socket = io.connect(`${process.env.REACT_APP_API_URL}/task?token=${token.access_token}`, {
  'force new connection': true,
  //transports: ['websocket']
  //"transports": ["xhr-polling"]
})
//socket.send('hello world')
socket.on('connect', function () {
  logger.info('connect')
  socket.send('hello world')
  socket.emit('join', {
    user: token.userName
  })
})
//socket.send('hello world')
//join private chat

socket.on('event', function (data) {
  logger.info('event...')
})
socket.on('currentStatus', function (data) {
  logger.info(data)
});
socket.on('disconnect', function () {
  logger.info('disconnect')
})

//pause the keyword polish
socket.on('keyword_pause', function (data) {
  logger.info('keyword_pause start...')
  jobContext.dirty(data._id)
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
  //socket.emit('finished')
});

//创建关键字,重新扫描排名
socket.on('keyword_create', function (doc) {
  logger.info('socket keyword_create', doc)
  //jobContext.clean();
  scanJober.execute(doc)
  //socket.emit('finished')
})

socket.on('keyword_polish', function (data) {
  jobContext.clean();
  polishJober.itemsPush(data);
  socket.emit('finished')
})