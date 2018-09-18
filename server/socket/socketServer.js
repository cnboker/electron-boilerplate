var User = require("../api/User/Model");

var logger = require("../logger");
var socketRoom = require('./socketRoom')

const EventEmitter = require('events');
const clients = {};

class SocketServer extends EventEmitter {

  SocketServer(server) {
    var io = require("socket.io")(server);
    io.on("connection", function (socket) {
      logger.info("a user conneted");
      //加入room
      roomSocket.join(socket)

      socket.on("hello", function (data) {
        logger.info(`user ${data.user} hello`);
        socket.nickname = data.user;
        clients[data.user] = socket;

        //更新User info
        User.findOne({
          userName: data.user
        }, function (err, doc) {
          doc.lastLoginDate = new Date();
          doc.save();
        });
      });

      //socket disconnect
      socket.on("disconnect", function () {
        delete clients[socket.nickname];
        console.log("clients", clients);
        roomSocket.leave(socket)
      });
    });

    io.on("disconnect", function () {
      logger.info("user disconnection");
    });

    io.on("error", function (data) {
      logger.info(data || "error");
    });
  }
  //关键字创建， 通知客户端做scan动作
  keywordCreate(doc) {
    var socket = this.find(doc.user);
    if (socket) {
      socket.emit('keyword_create', doc)
    }
  }

  find(userName) {
    return clients[userName]
  }
  //rank完成，通知在线客户端polish， 对于新用户会给出3个关键字的机会，这样的目的是留住新用户，尽快让用户能看到结果
  keywordRank(doc) {

  }
  //用户关键暂停或删除，通知其他用户不再polish
  keywordPause(user, _id) {
    var socket = this.find(user)
    if (socket) {
      socket
        .broadcast
        .emit('keyword_pause', {_id})
    }
  }

  //管理员广播新消息
  message(msg) {}

  isOnline(user) {
    return this.find(user) !== undefined
  }
}
module.exports = SocketServer;
