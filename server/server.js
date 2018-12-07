var express = require("express"),
  app = express(),
  cors = require("cors"),
  port = process.env.PORT || 3001;

//receive crash info
var http = require("http").Server(app);
var logger = require("./logger");

var cookieParser = require("cookie-parser");
app.use(cookieParser());

var mongoose = require("mongoose"); //.set('debug', true);
//mongoose add promise ablity Promise.promisifyAll(mongoose); //AND THIS LINE
mongoose.Promise = require("bluebird");
//mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost/kwPolish");

require("./appCrashReporter")(app);

var SocketServer = require("./socket/socketServer");
const socketServer = new SocketServer(http);

var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
// Adding body-parser middleware to parser JSON data
app.use(bodyParser.json());
app.use(cors());
//inject socketServer
app.use((req, res, next) => {
  if (!req.socketServer) {
    //console.log('inject socketServer')
    req.socketServer = socketServer;
  }
  next();
});

app.get("/404", function(req, res) {
  throw new NotFound();
});

app.get("/500", function(req, res) {
  throw new Error("keyboard cat!");
});

require("./api/protected")(app);
require("./api/Keyword/Route")(app);
require("./api/User/Route")(app);
require("./api/Balance/Route")(app);
require("./api/Event/Route")(app);
require('./api/SN/Route')(app);

//exception handle
app.use(function(err, req, res, next) {
  
  if(err){
    if (err.status) {
      return res.status(err.status).json(err);
    } else if (err.output) {
      res.status(err.output.statusCode).json(err.output.payload);
    } else {
      console.info('err',err)
      res.send(err);
    }
  }
  
});

//var server = app.listen(port)
http.listen(port, function() {
  logger.info("restfull api start..." + port);
});

module.exports = app;
