var jobContext = require("./jobContext");
const logger = require("../logger");
var ipc = require('../ipc/ipcBus');

//open debug info
if (process.env.APP != "web") {
  //localStorage.debug = "*";
}
var io = require("socket.io-client");

//var intervalID;
exports.main = function main(token) {
  console.log("begin run socket client");
  var socket = io(
    `${process.env.REACT_APP_AUTH_URL}?token=${token.access_token}`.replace('http://','ws://'),
    {
      //forceNew: true,
      autoConnect: true,
      reconnection: true,
      reconnectionDelay: 1000,
      //transports: ['websocket'], //resolve 503 error
      //rejectUnauthorized: false
      //reconnectionAttempts: 10
    }
  );
 
  socket.on("connect", function() {
    logger.info("socket connected");
    socket.emit("hello", {
      user: token.userName
    });
  });

  socket.on("reconnect", function() {
    console.log("reconnect fired!");  
  });

  socket.on("event", function(data) {
    logger.info("event...", data);
  });

  socket.on("currentStatus", function(data) {
    logger.info("currentStatus" + data);
  });

  socket.on("reconnect_attempt", attemptNumber => {
    // ...
    logger.info("reconnect_attempt", attemptNumber);
  });

  socket.on("disconnect", function() {
    logger.info("disconnect");

    // checkNetwork(function() {
    //   socket.connect();
    // });
  });

  //pause the keyword polish
  socket.on("keyword_pause", function(data) {
    logger.info("keyword_pause start...");
    jobContext.dirty(data._id);
  });


  
  socket.on("error", function(data) {
    console.log("error", data);
    logger.info(data || "error");
  });

  socket.on("connect_failed", function(data) {
    logger.info("connect_failed", data || "connect_failed");
  });
  //clean the keyword polish
  socket.on("keyword_clean", function(data) {
    jobContext.clean();
  });


  //服务器远程增加新优化关键词
  socket.on("keyword_polish", function(doc) {
    console.log("keyword_polish", doc);
    ipc.sendToFront('keyword_update',doc);
  });
};

function checkNetwork(callback) {
  var timer = setInterval(function() {
    require("dns").lookup("www.baidu.com", function(err) {
      if (err && err.code == "ENOTFOUND") {
        console.log("No connection");
      } else {
        //console.log("Connected");
        clearInterval(timer);
        if (callback) callback();
      }
    });
  }, 2000);
}
