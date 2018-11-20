"use strict";

var boom = require("boom");
var moment = require("moment");

var Keyword = require("./Model");
var PolishLog = require("./PolishlogModel");
var User = require("../User/Model");

var simpleStrategy = require("./taskSimpleStrategy");
var logger = require("../../logger");
var keywordPool = require("../../socket/keywordPool");

exports.finishedPool = function(req, res) {
  return res.json(keywordPool.finishedPool);
};

exports.sharePool = function(req, res) {
  return res.json(keywordPool.sharePool);
};

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

exports.history = function(req, res) {
  PolishLog.find(
    {
      keyword_id: req.params.id
    },
    "dynamicRank createDate",
    {
      sort: {
        createDate: 1
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
  //console.log("ListByUserName=", username);
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
  Promise.all([
    User.findOne({
      userName: req.user.sub
    }),
    Keyword.find({
      user: req.user.sub
    })
      .lean()
      .exec()
  ])
    .then(([user, docs]) => {
      var keywords = req.body.keyword.split("\n").filter(function(val) {
        return val.trim().length > 1;
      });

      var saveKeywords = docs.map(item => {
        return item.keyword;
      });
      console.log("saveKeywords", saveKeywords);
      //remove duplicate
      keywords = keywords.filter(function(item, pos) {
        return keywords.indexOf(item) == pos && !saveKeywords.includes(item);
      });
      var grade = user.grade || 1;
      if (grade == 1) {
        if (docs.length + keywords.length > 5) {
          throw "你提交的关键词已超出限制。免费版用户默认提交关键词数量为5个。你可以通过持续使用本工具，随着使用时长，系统会自动增加可提交关键词数量。当然，现在升级VIP用户，马上就能提交更多关键词";
        }
        var exists = docs.filter(function(doc) {
          return doc.link == req.body.link;
        });
        if (docs.length > 0 && exists.length == 0) {
          throw "普通账号只能增加一个域名";
        }
      }
      if (keywords.length == 0) {
        res.json([]);
        return;
      }

      console.log("keywords ---", keywords);

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
      res.json(docs.ops);
      // console.log("docs", docs);

      //socket send notify
      // for (var doc of docs.ops) {
      //   req.socketServer.keywordCreate(doc);
      // }
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

      obj.keyword = req.body.keyword;
      obj.link = req.body.link;
      if (req.body.status) {
        obj.status = req.body.status;
        if (obj.status == 2) {
          console.log("emit keyword_pause");
          //notify
          //cmd,data
          //in order to send an event to everyone
          req.socketServer.keywordPause(req.user.sub, req.params.id);
        }
      }

      // if (obj.originRank == 0) {
      //   //私信给特定用户
      //   taskio.to(req.user.sub).emit("keyword_create", obj.toObject());
      // }

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
      req.socketServer.keywordPause(req.user.sub, req.params.id);
    }
  );
};

//scan job
exports.rank = function(req, res, next) {
  //console.log("server rank  body", req.body);
  if (req.body.rank == null) return;

  Keyword.findOneAndUpdate(
    {
      _id: req.body._id
    },
    {
      originRank: req.body.rank,
      dynamicRank: req.body.rank,
      engine: req.body.engine,
      isValid: req.body.rank != -1
    },
    {
      //同时设置这2个参数，否则doc返回null
      new: true,
      upsert: true
    }
  )
    .then(doc => {
      //console.log("rank doc", doc);
      req.socketServer.keywordRank(doc);
      res.json(doc);
    })
    .catch(e => {
      return next(boom.badRequest(e));
    });
};

exports.tasks = function(req, res, next) {
  return res.json(keywordPool.reqTask(req.user.sub));
};

exports.tasksv1 = function(req, res, next) {
  var inDoTasksTime = (() => {
    var startTime = 9 * 60;
    var endTime = 18 * 60 + 30;
    var d = new Date();
    var nowTime = d.getHours() * 60 + d.getMinutes();
    return nowTime > startTime && nowTime < endTime;
  })();
  // if (!inDoTasksTime) return res.json([]);

  var hrstart = process.hrtime();
  Promise.all([
    User.find({
      locked: true
    }),
    User.findOne({
      userName: req.user.sub
    })
  ])
    .then(([blackUsers, currentUser]) => {
      var names = blackUsers.map(x => {
        return x.userName;
      });
      return Keyword.find(
        {
          isValid: true,
          status: 1,
          engine: currentUser.engine,
          originRank: {
            $gt: 1,
            $ne: -1
          }, //原始排名>10 and != -1
          user: {
            $nin: names
          }
        },
        "_id user originRank dynamicRank keyword link", //only selecting the "_id" and "keyword" , "engine" "link"fields,
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
      logger.info("exports.tasks docs", docs);
      res.json(simpleStrategy(docs));

      var hrend = process.hrtime(hrstart);
      console.info(
        "Execution time (hr): %ds %dms",
        hrend[0],
        hrend[1] / 1000000
      );
    })
    .catch(e => {
      return next(boom.badRequest(e));
    });
};

//关键字擦亮结果处理
exports.polish = function(req, res, next) {
  //console.log('polish body', req.body)
  var upsertData = {
    $set: {
      dynamicRank: req.body.rank,
      lastPolishedDate: new Date()
    },
    $inc: {
      polishedCount: 1
    }
  };
  var lastDynamicRank = 0;
  Promise.all([
    Keyword.findOne({
      _id: req.body._id
    }),
    User.findOne({
      userName: req.user.sub
    })
  ])
    .then(([keyword, user]) => {
      lastDynamicRank = keyword.dynamicRank;
      if (!keyword.originRank) {
        keyword.originRank = req.body.rank || -1;
      }
      if (keyword.originRank > 0 && req.body.rank == undefined) {
        throw "skip rank=-1";
      }
      if (keyword.dynamicRank <= 80 && req.body.rank == -1) {
        throw "skip rank=-1";
      }
      return { keyword, user };
    })
    .then(result => {
      var rankDiff = (result.keyword.dynamicRank || 0) - req.body.rank;
      if (!result.user.rank) {
        result.user.rank = 0;
      }
      result.user.rank += rankDiff;
      result.user.save();
      return result;
    })
    .then(result => {
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
      // console.log(
      //   "polish doc",
      //   doc.keyword,
      //   doc.link,
      //   doc.originRank,
      //   doc.dynamicRank
      // );
      var ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
      var log = new PolishLog({
        keyword_id: req.body._id,
        user: req.user.sub,
        keyword: doc.keyword,
        createDate: new Date(),
        dynamicRank: doc.dynamicRank,
        lastDynamicRank,
        ip: ip
      });
      log.save();
      keywordPool.polishFinished(req.user.sub, doc.toObject());
      res.json(doc);
    })
    .catch(e => {
      logger.error(e);
      return next(boom.badRequest(e));
    });

  // Keyword.findOne({
  //   _id: req.body._id
  // })
  //   .then(function(doc) {
  //     // console.log('polish doc', doc)
  //     //if (doc.dynamicRank == null) throw "dynamicRank is not null";
  //     if (!doc.originRank) {
  //       doc.originRank = req.body.rank || -1;
  //     }
  //     if (doc.originRank > 0 && req.body.rank == undefined) {
  //       throw "skip rank=-1";
  //     }
  //     if (doc.dynamicRank <= 80 && req.body.rank == -1) {
  //       throw "skip rank=-1";
  //     }
  //     return Keyword.findOneAndUpdate(
  //       {
  //         _id: req.body._id
  //       },
  //       upsertData,
  //       {
  //         //同时设置这2个参数，否则doc返回null
  //         upsert: true,
  //         new: true //return the modified document rather than the original. defaults to false
  //       }
  //     );
  //   })
  //   .then(function(doc) {
  //     console.log("polish doc", doc.keyword, doc.link, doc.originRank, doc.dynamicRank);
  //     var ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  //     var log = new PolishLog({
  //       keyword_id: req.body._id,
  //       user: req.user.sub,
  //       keyword: doc.keyword,
  //       createDate: new Date(),
  //       dynamicRank:doc.dynamicRank,
  //       ip: ip
  //     });
  //     log.save();
  //     keywordPool.polishFinished(req.user.sub, doc.toObject());

  //     res.json(doc);
  //   })
  //   .catch(e => {
  //     logger.error(e);
  //     return next(boom.badRequest(e));
  //   });
};
