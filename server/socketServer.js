var User = require("./api/User/Model");

var logger = require("./logger");
var socketRoom = require('./socketRoom')

//关键字创建， 通知客户端做scan动作
module.exports.keywordCreate = function(doc){

}

//rank完成，通知在线客户端polish， 对于新用户会给出3个关键字的机会，这样的目的是留住新用户，尽快让用户能看到结果
module.exports.keywordRank = function(doc){

}

//用户关键暂停或删除，通知其他用户不再polish
module.exports.keywordPause = function(doc){

}

module.exports.start = function(app, server) {
  var io = require("socket.io")(server);
  io.path("/api/task");

  app.io = io;
  const taskio = io.of("/api/task");
  const clients = {};
  app.clients = clients;

  taskio.on("connection", function(socket) {
    logger.info("a user conneted");
    //加入room
    roomSocket.join(socket)
    // socket.nickname = data.user;
    // clients[data.user] = socket;
    // socket.on("message", function(data) {
    //   logger.info("received data", data);
    // });
    //join room
    socket.on("join", function(data) {
      logger.info(`user ${data.user} join`);
      socket.join(data.user);
      socket.nickname = data.user;
      clients[data.user] = socket;

      //更新User info
      User.findOne(
        {
          userName: data.user
        },
        function(err, doc) {
          doc.lastLoginDate = new Date();
          doc.save();
        }
      );
    });

    //socket disconnect
    socket.on("disconnect", function() {
      delete clients[socket.nickname];
      console.log("clients", clients);
      roomSocket.leave(socket)
    });
  });

  taskio.on("disconnect", function() {
    logger.info("user disconnection");
  });

  taskio.on("error", function(data) {
    logger.info(data || "error");
  });

  //end
};
