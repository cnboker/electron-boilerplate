var User = require("../api/User/Model");

var logger = require("../logger");
var socketRoom = require('./socketRoom')

const EventEmitter = require('events');
const clients = {};
var moment = require('moment')
var random = require('../utils/random')

class SocketServer extends EventEmitter {

  constructor(server) {
    super();
    var io = require("socket.io")(server)
    io.on("connection", function (socket) {
      logger.info("a user conneted");
      //加入room
      socketRoom.join(socket)

      socket.on("hello", function (data) {
        logger.info(`user ${data.user} hello`);
        socket.nickname = data.user;
        clients[data.user] = socket;
        //更新User info
        User.findOne({
          userName: data.user
        }, function (err, doc) {
          doc.lastLoginDate = new Date();
          doc.status = 1;
          doc.save();
        });
      });

      //socket disconnect
      socket.on("disconnect", function () {
        delete clients[socket.nickname];
        //console.log("clients", clients);
        User
          .findOne({userName: socket.nickname})
          .then(doc => {
            doc.status = 0;
            doc.save();
          })
          .catch(err => {
            console.log(err)
          });
          socketRoom.leave(socket)
          
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
    console.log('keywordCreate doc=', doc)
    var socket = this.find(doc.user);
    //console.log('keywordCreate socket=', socket)
    if (socket) {
      socket.emit('keyword_create', doc)
    }
  }

  find(userName) {
    return clients[userName]
  }

  //rank完成，通知在线客户端polish， 对于新用户会给出3个关键字的机会，这样的目的是留住新用户，尽快让用户能看到结果
  keywordRank(doc) {
    if (doc.originRank == -1) 
      return;
    var min = 5; //5s
    var max = 60; // 20s
    var next = moment().add(random(min, max), 'seconds');
    doc.runTime = next.format('YYYY-MM-DD HH:mm:ss')

    var mergeDoc = {
      ...doc.toObject(),
      runTime: next.format('YYYY-MM-DD HH:mm:ss')
    }
    console.log('keywordRank mergeDoc=', mergeDoc)
    if (!this.userPtr) {
      this.userPtr = 0;
    }
    var keys = Object.keys(clients);
    if (this.userPtr >= keys.length) {
      this.userPtr = 0;
    }
    var socket = clients[keys[this.userPtr]]
    if (socket) {
      socket.emit('keyword_polish', mergeDoc)
    }
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
    return this.find(user) != undefined
  }
}
module.exports = SocketServer;
