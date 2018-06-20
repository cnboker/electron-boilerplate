var express = require('express'),
  app = express(),
  cors = require('cors'),
  port = process.env.PORT || 3001;

  var http =require('http').Server(app)
var io = require('socket.io')(http);
io.path('/api/task');
app.io = io;

var Keyword = require('./api/Keyword/Model');
var User = require('./api/User/Model');

var mongoose = require('mongoose');
var bodyParser = require('body-parser');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/kwPolish');


app.use(bodyParser.urlencoded({
  extended: true
}))
// Adding body-parser middleware to parser JSON data
app.use(bodyParser.json());
app.use(cors());

// app.use(function (req, res, next) {
//   // Website you wish to allow to connect
//   res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');

//   // Request methods you wish to allow
//   res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

//   // Request headers you wish to allow
//   res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

//   // Set to true if you need the website to include cookies in the requests sent
//   // to the API (e.g. in case you use sessions)
//   res.setHeader('Access-Control-Allow-Credentials', true);



//   // Pass to next layer of middleware
//   next();

//   // res.status(404).send({url: req.originalUrl + ' not found'});


// });

// app.use(function (req, res, next) {
//   // Website you wish to allow to connect
//   res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');

//   // Request methods you wish to allow
//   res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

//   // Request headers you wish to allow
//   res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

//   // Set to true if you need the website to include cookies in the requests sent
//   // to the API (e.g. in case you use sessions)
//   res.setHeader('Access-Control-Allow-Credentials', true);



//   // Pass to next layer of middleware
//   next();

//   // res.status(404).send({url: req.originalUrl + ' not found'});


// });

app.get('/404', function (req, res) {
  throw new NotFound;
});

app.get('/500', function (req, res) {
  throw new Error('keyboard cat!');
});

require('./protected')(app);
require('./api/Keyword/Route')(app);
require('./api/User/Route')(app);

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

//var server = app.listen(port)
http.listen(port,function(){
  console.log('restfull api start...' + port)

})

module.exports = app;
