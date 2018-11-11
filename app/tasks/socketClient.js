var jobContext = require("./jobContext");
var polishJober = require("./polishJober");
const logger = require("../logger");
const messager = require("./ipcSender");

//open debug info
if (process.env.APP != "web") {
  //localStorage.debug = "*";
}

//var intervalID;
exports.main = function main(token) {
  console.log("begin run socket client", token);
  var io = require("socket.io-client");
  var socket = io(
    `${process.env.REACT_APP_AUTH_URL}?token=${token.access_token}`,
    {
      //forceNew: true,
      autoConnect: false,
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 10
    }
  );
  socket.open();

  socket.on("connect", function() {
    // once client connects, clear the reconnection interval function
    // if (intervalID) {
    //   clearInterval(intervalID);
    // }

    //... do other stuff
    logger.info("socket connected");
    socket.emit("hello", {
      user: token.userName
    });
  });

  socket.on("reconnect", function() {
    console.log("reconnect fired!");
    // checkNetwork(function(){
    //   socket.open();
    // })
  });

  socket.on("event", function(data) {
    logger.info("event...", data);
  });

  socket.on("currentStatus", function(data) {
    logger.info("currentStatus" + data);
  });

  socket.on("reconnect_attempt", attemptNumber => {
    // ...
    console.log("reconnect_attempt", attemptNumber);
  });

  socket.on("disconnect", function() {
    logger.info("disconnect");

    checkNetwork(function() {
      socket.connect();
    });
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
    //socket.emit('finished')
  });

  //创建关键词,重新扫描排名
  // socket.on("keyword_create", function(doc) {
  //   messager("message", `关键词"${doc.keyword}"等待优化`);
  //   logger.info("socket keyword_create", doc);
  //   scanJober.execute(doc);
  // });


  //服务器远程增加新优化关键词
  socket.on("keyword_polish", function(doc) {
    console.log("keyword_polish", doc);
    //polishJober.singlePush(doc);
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
