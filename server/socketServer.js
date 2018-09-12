var User = require('./api/User/Model')

module.exports = function(app, server) {
  var logger = require("./logger");
  var io = require("socket.io")(server);
  io.path("/api/task");
  app.io = io;

  const taskio = io.of("/api/task");
  const clients = {};
  app.clients = clients;

  taskio.on("connection", function(socket) {
    logger.info("a user conneted");

    socket.on("message", function(data) {
      logger.info("received data", data);
    });
    //join room
    socket.on("join", function(data) {
      logger.info(`user ${data.user} join`);
      socket.join(data.user);
      socket.nickname = data.user;
      clients[data.user] = socket;
     
      //更新User info
      User.findOne({
        userName:data.user
      },function(err,doc){
        doc.lastLoginDate = new Date();
        doc.save();
      })

    });

    //socket disconnect
    socket.on("disconnect", function() {
      delete clients[socket.nickname];
      console.log("clients", clients);
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
