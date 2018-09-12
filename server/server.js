var express = require('express'),
app = express(),
cors = require('cors'),
port = process.env.PORT || 3001;

//receive crash info
var http = require('http').Server(app)
var logger = require('./logger')

var cookieParser = require('cookie-parser')
app.use(cookieParser())

var mongoose = require('mongoose').set('debug', true);
//mongoose add promise ablity Promise.promisifyAll(mongoose); //AND THIS LINE
mongoose.Promise = require('bluebird');
//mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/kwPolish');

require('./appCrashReporter')(app)
require('./socketServer')(app,http)

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}))
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


//exception handle
app.use(function (err, req, res, next) {
  if (err.isServer) {
    // log the error... probably you don't want to log unauthorized access or do
    // you?
  }
  logger.error(err);
  if (err.status == 401) {
    return res
      .status(err.status)
      .json(err);
  }
  return res
    .status(err.output.statusCode)
    .json(err.output.payload);

})

//var server = app.listen(port)
http.listen(port, function () {
  logger.info('restfull api start...' + port)
})

module.exports = app;
