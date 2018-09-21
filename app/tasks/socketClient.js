var jobContext = require("./jobContext");
var scanJober = require("./scanJober");
var polishJober = require("./polishJober");
const auth = require("../auth");
const logger = require("../logger");
const messager = require("./ipcSender");

//open debug info
if (process.env.APP != "web") {
  //ocalStorage.debug = "*";
}

auth.waitUtilGetToken(main);

function main(token) {
  var io = require("socket.io-client");
  //console.log(process.env.REACT_APP_API_URL)
  //require add namespace 'task' otherwise not connect if namespace is 'task'
  var socket = io.connect(
    `${process.env.REACT_APP_AUTH_URL}?token=${token.access_token}`,
    {
      "force new connection": true
      //transports: ['websocket']
      //"transports": ["xhr-polling"]
    }
  );
  //socket.send('hello world')
  socket.on("connect", function() {
    logger.info("connect");
    //socket.send("hello world");
    socket.emit("hello", {
      user: token.userName
    });
  });

  socket.on("reconnect", function() {
    console.log("reconnect fired!");
    socket.emit("hello", {
      user: token.userName
    });
  });

  socket.on("event", function(data) {
    logger.info("event...");
  });
  socket.on("currentStatus", function(data) {
    logger.info(data);
  });
  socket.on("disconnect", function() {
    logger.info("disconnect");
  });

  //pause the keyword polish
  socket.on("keyword_pause", function(data) {
    logger.info("keyword_pause start...");
    jobContext.dirty(data._id);
  });

  socket.on("error", function(data) {
    logger.info(data || "error");
  });

  socket.on("connect_failed", function(data) {
    logger.info(data || "connect_failed");
  });
  //clean the keyword polish
  socket.on("keyword_clean", function(data) {
    jobContext.clean();
    //socket.emit('finished')
  });

  //创建关键字,重新扫描排名
  socket.on("keyword_create", function(doc) {
    messager("message", `关键字"${doc.keyword}"等待优化`);
    logger.info("socket keyword_create", doc);
    scanJober.execute(doc);
  });

  //服务器远程增加新优化关键字
  socket.on("keyword_polish", function(doc) {
    console.log("keyword_polish", doc);
    polishJober.singlePush(doc);
  });
}
