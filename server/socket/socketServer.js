var User = require("../api/User/Model");

var logger = require("../logger");

const EventEmitter = require("events");
const clients = {};

var pool = require("./keywordPool");
var sharePool = require("./sharePool");

class SocketServer extends EventEmitter {
  constructor(server) {
    super();
    var io = require("socket.io")(server);
    io.on("connection", function(socket) {
      logger.info("a user conneted");
      console.log('connections',Object.keys(clients).length);
      //加入room
      //socketRoom.join(socket);
      var cc = io.sockets.clients();
      console.log('clients', Object.keys(cc.sockets).length)
      //var clientIp = socket.request.connection.remoteAddress;
    
      socket.on("hello", function(data) {
        logger.info(`user ${data.user} hello`);
        socket.nickname = data.user;
        // if(clients[data.user]){
        //   clients[data.user].disconnect();
        // }
        clients[data.user] = socket;
        //更新pool;
        pool.userJoin(data.user);
      });

      //socket disconnect
      socket.on("disconnect", function(reason) {
        console.log('disconnect, ' + reason)
        socket.disconnect();
        if (socket.nickname) {
          delete clients[socket.nickname];
          //console.log("clients", clients);
          logger.info(socket.nickname + " leave,") + reason;
          //socketRoom.leave(socket);
          pool.userLeave(socket.nickname);
        }
      });
    });

    io.on("disconnect", function() {
      logger.info("user disconnection");
    });

    io.on("error", function(data) {
      logger.info(data || "error");
    });
  }
  //关键词创建， 通知客户端做scan动作
  keywordCreate(doc) {
    //console.log("keywordCreate doc=", doc);
    var socket = this.find(doc.user);
    //console.log('keywordCreate socket=', socket)
    if (socket) {
      socket.emit("keyword_create", doc);
    }
  }

  find(userName) {
    return clients[userName];
  }

  //rank完成，通知在线客户端polish， 对于新用户会给出3个关键词的机会，这样的目的是留住新用户，尽快让用户能看到结果
  keywordRank(doc) {
    var socket = clients[doc.user];
    if (socket) {
      socket.emit("refreshPage");
    }
    sharePool.push(doc)
  }

  //用户关键暂停或删除，通知其他用户不再polish
  keywordPause(user, _id) {
    var socket = this.find(user);
    if (socket) {
      socket.broadcast.emit("keyword_pause", { _id });
    }
  }

  //管理员广播新消息
  message(msg) {}

  isOnline(user) {
    return this.find(user) != undefined;
  }
}
module.exports = SocketServer;
