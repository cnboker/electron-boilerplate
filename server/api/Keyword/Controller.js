"use strict";

var boom = require("boom");
var moment = require("moment");

var Keyword = require("./Model");
var PolishLog = require("./PolishlogModel");
var User = require("../User/Model");

var simpleStrategy = require("./taskSimpleStrategy");
var logger = require("../../logger");

exports.today = function(req, res) {
  //var today = moment().startOf('day')
  //var tomorrow = moment(today).endOf('day')
  // var start = new Date();
  // start.setHours(0, 0, 0, 0);

  // var end = new Date();
  // end.setHours(23, 59, 59, 999);
  //console.log("start=",  (new Date(start)).toString('yyyy-MM-dd HH:mm:ss'), (new Date(now)).toString("yyyy-MM-dd HH:mm:ss") );

  var start = moment
    .utc()
    .startOf("day")
    .toDate();
  var end = moment
    .utc()
    .endOf("day")
    .toDate();

  console.log("start=", start, end);
  Keyword.find({
    createDate: {
      $gt: start,
      $lt: end
    }
  })
    .sort({
      createDate: -1
    })
    .exec()
    .then(docs => {
      res.json(docs);
    })
    .catch(err => {
      res.send(err);
    });
};

exports.list = function(req, res) {
  console.log("req.query:", req.query);
  if (req.user.sub === "admin") {
    ListByUserName(res, req.query.userName);
  } else {
    ListByUserName(res, req.user.sub);
  }
};

function ListByUserName(res, username) {
  console.log("ListByUserName=", username);
  Keyword.find(
    {
      user: username
    },
    null,
    {
      sort: {
        createDate: -1
      }
    },
    function(err, data) {
      if (err) {
        res.send(err);
        return;
      }
      res.json(data);
    }
  );
}

exports.create = function(req, res, next) {
  delete req.body._id;
  User.findOne({
    userName: req.user.sub
  })
    .then(user => {
      return new Promise((resolve, reject) => {
        var grade = user.grade || 1;

        Keyword.find({
          user: req.user.sub
        }).then(docs => {
          if (grade == 1) {
            if (docs.length == 5) {
              reject("普通账号关键字数不能大于5个，请升级为标准账号");
            }
            var exists = docs.filter(function(doc) {
              return doc.link == req.body.link;
            });
            if (docs.length > 0 && exists.length == 0) {
              reject("普通账号只能增加一个域名");
            }
          }
          exists = docs.filter(function(doc) {
            return doc.link == req.body.link && doc.keyword == req.body.keyword;
          });
          if (exists.length > 0) {
            reject("关键字重复错误");
          }
          resolve(user);
        });
      });
    })
    .then(user => {
      var keywords = req.body.keyword.split("\n").filter(function(val) {
        return val.trim().length > 1;
      });
      console.log("keyword=", keywords);
      var docs = [];
      for (var keyword of keywords) {
        docs.push({
          link: req.body.link,
          keyword,
          createDate: new Date(), //必须传new date()进去，传Date.now()进去为double,传Date()进去为string
          originRank: 0,
          dynamicRank: 0,
          todayPolished: false,
          polishedCount: 0,
          user: req.user.sub,
          status: 1,
          engine: user.engine
        });
      }
      return Keyword.collection.insertMany(docs);
    })
    .then(docs => {
      res.json(docs);
      console.log("docs", docs);
      //socket send notify
      const taskio = req.app.io.of("/api/task");
      for (var doc of docs.ops) {
        taskio.to(req.user.sub).emit("keyword_create", doc);
      }
    })
    .catch(e => {
      logger.error(e);
      return next(boom.badRequest(e));
    });
};

exports.read = function(req, res) {
  Keyword.findById(req.params.id, function(err, entity) {
    if (err) {
      res.send(err);
      return;
    }
    res.json(entity);
  });
};

exports.update = function(req, res) {
  Keyword.findOne(
    {
      _id: req.params.id
    },
    function(err, obj) {
      if (obj.originRank == -1 && obj.keyword != req.body.keyword) {
        obj.originRank = 0;
      }

      const taskio = req.app.io.of("/api/task");

      obj.keyword = req.body.keyword;
      obj.link = req.body.link;
      if (req.body.status) {
        obj.status = req.body.status;
        if (obj.status == 2) {
          console.log("emit keyword_pause");
          //notify
          //cmd,data
          //in order to send an event to everyone
          taskio.emit("keyword_pause", {
            _id: req.params.id
          });
        }
      }

      if (obj.originRank == 0) {
        //私信给特定用户
        taskio.to(req.user.sub).emit("keyword_create", obj.toObject());
      }

      obj.save(function(err, doc) {
        if (err) {
          res.send(err);
          return;
        }
        res.json(doc);
      });
    }
  );
};

exports.delete = function(req, res) {
  Keyword.remove(
    {
      _id: req.params.id
    },
    function(err, entity) {
      if (entity.user !== req.user.sub && entity.user !== "admin") {
        res.json({
          message: "删除失败"
        });
        return;
      }
      if (err) {
        res.send(err);
        return;
      }
      res.json({
        message: "delete success"
      });
      const taskio = req.app.io.of("/api/task");
      taskio.emit("keyword_pause", {
        _id: req.params.id
      });
    }
  );
};

//scan job
exports.rank = function(req, res) {
  console.log("server rank  body", req.body);
  Keyword.findOneAndUpdate(
    {
      _id: req.body._id
    },
    {
      originRank: req.body.rank,
      engine: req.body.engine,
      isValid: req.body.rank != -1
    },
    {
      //同时设置这2个参数，否则doc返回null
      new: true,
      upsert: true
    },
    function(err, doc) {
      console.log("server rank doc:", doc);
      if (err) {
        res.send(err);
        return;
      }
      res.json(doc);
    }
  );
};

exports.tasks = function(req, res, next) {
  var inDoTasksTime = (() => {
    var startTime = 9 * 60;
    var endTime = 18 * 60 + 30;
    var d = new Date();
    var nowTime = d.getHours() * 60 + d.getMinutes();
    return nowTime > startTime && nowTime < endTime;
  })();
  var hrstart = process.hrtime()
  if (!inDoTasksTime) return res.json([]);
  User.find({
    locked:true
  })
    .then(lockedUsers => {
      return lockedUsers.map(x => {
        return x.userName;
      });
    })
    .then(names => {
      console.log('black users', names)
      User.findOne({
        userName: req.user.sub
      })
        .then(user => {
          console.log("user engine", user);
          //获取点数>0且今天未擦亮的关键字
          return Keyword.find(
            {
              isValid: true,
              status: 1,
              engine: user.engine,
              originRank: { $gt: 10, $ne: -1 }, //原始排名>10 and != -1
              user: { $nin: names }
            },
            "_id user originRank keyword link", //only selecting the "_id" and "keyword" , "engine" "link"fields,
            {
              sort: {
                createDate: -1
              }
            }
          )
            .lean()
            .exec();
        })
        .then(docs => {
          logger.info("docs", docs);
          res.json(simpleStrategy(docs));

          var hrend = process.hrtime(hrstart)
          console.info('Execution time (hr): %ds %dms', hrend[0], hrend[1] / 1000000)
        })
        .catch(e => {
          return next(boom.badRequest(e));
        });
    });
};

//关键字擦亮结果处理
exports.polish = function(req, res, next) {
  var upsertData = {
    $set: {
      dynamicRank: req.body.rank,
      lastPolishedDate: new Date()
    },
    $inc: {
      polishedCount: 1
    }
  };

  Keyword.findOne({
    _id: req.body._id
  })
    .then(function(doc) {
      if (
        doc.originRank > 0 &&
        (req.body.rank == null || req.body.rank == -1)
      ) {
        throw "skip rank=-1";
      }
      return Keyword.findOneAndUpdate(
        {
          _id: req.body._id
        },
        upsertData,
        {
          //同时设置这2个参数，否则doc返回null
          upsert: true,
          new: true //return the modified document rather than the original. defaults to false
        }
      );
    })
    .then(function(doc) {
      var ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
      var log = new PolishLog({
        keyword_id: req.body._id,
        user: req.user.sub,
        keyword: doc.keyword,
        createDate: new Date(),
        ip: ip
      });
      log.save();
      res.json(doc);
    })
    .catch(e => {
      logger.error(e);
      return next(boom.badRequest(e));
    });
};
