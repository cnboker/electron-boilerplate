var express = require('express'),
  app = express(),
  cors = require('cors'),
  port = process.env.PORT || 3001;

  var http =require('http').Server(app)
var io = require('socket.io')(http);
io.path('/api/task');
app.io = io;

var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var Promise = require('bluebird'); //ADD THIS LINE
//mongoose add promise ablity
//Promise.promisifyAll(mongoose); //AND THIS LINE
mongoose.Promise = Promise;
var logger = require('./logger')
var Keyword = require('./api/Keyword/Model');
var User = require('./api/User/Model');
var Balance = require('./api/Balance/Model')

//mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/kwPolish');


app.use(bodyParser.urlencoded({
  extended: true
}))
// Adding body-parser middleware to parser JSON data
app.use(bodyParser.json());
app.use(cors());

app.get('/404', function (req, res) {
  throw new NotFound;
});

app.get('/500', function (req, res) {
  throw new Error('keyboard cat!');
});

require('./protected')(app);
require('./api/Keyword/Route')(app);
require('./api/User/Route')(app);
require('./api/Balance/Route')(app);

const taskio = io.of('/api/task');
taskio.on('connection',function(socket){
  console.log('a user conneted');
  
  socket.on('message',function(data){
    console.log('received data', data);
  })
})

taskio.on('disconnect',function(){
  console.log('user disconnection')
})

taskio.on('error', function (data) {
  console.log(data || 'error');
});

//exception handle
app.use(function(err,req,res,next){
  if (err.isServer) {
    // log the error...
    // probably you don't want to log unauthorized access
    // or do you?
  }
  logger.error(err);
  return res.status(err.output.statusCode).json(err.output.payload);

})

//var server = app.listen(port)
http.listen(port,function(){
  console.log('restfull api start...' + port)

})

module.exports = app;
