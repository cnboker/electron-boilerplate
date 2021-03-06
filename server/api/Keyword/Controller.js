"use strict";

var boom = require("boom");
var moment = require("moment");

var Keyword = require("./Model");
var PolishLog = require("./PolishlogModel");
var User = require("../User/Model");

var logger = require("../../logger");
var time = require("../../utils/time");
const dayMaxKeywords = 500;

exports.taskPool = function(req, res) {
  var data = req.taskPool.stats();
  //return res.send(data);
  return res.json(data);
};

var today = (exports.today = function(req, res) {
  // var today = moment().startOf('day') var tomorrow = moment(today).endOf('day')
  // var start = new Date(); start.setHours(0, 0, 0, 0); var end = new Date();
  // end.setHours(23, 59, 59, 999); console.log("start=",  (new
  // Date(start)).toString('yyyy-MM-dd HH:mm:ss'), (new
  // Date(now)).toString("yyyy-MM-dd HH:mm:ss") );

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
    .sort({ createDate: -1 })
    .exec()
    .then(docs => {
      res.json(docs);
    })
    .catch(err => {
      res.send(err);
    });
});

exports.history = function(req, res) {
  PolishLog.find(
    {
      keyword_id: req.params.id,
      createDate: {
        $gte: moment().subtract("days", 90), //最近90天
        $lte: new Date()
      }
    },
    "dynamicRank createDate",
    {
      sort: {
        createDate: 1
      }
    }
  )
    .then(docs => {
      res.json(docs);
    })
    .catch(e => {
      return next(boom.badRequest(e));
    });
};

exports.websiteOfkeywords = function(req, res, next) {
  Keyword.aggregate([
    {
      $match: {
        user: req.user.sub
      }
    },
    {
      $group: {
        _id: "$link",
        count: {
          $sum: 1
        }
      }
    }
  ]).then(docs => {
    res.json(docs);
  });
};
//获取没有初始排名数据
exports.unRankKeywords = function(req, res) {
  Keyword.find({ user: req.user.sub, originRank: 0 })
    .then(docs => {
      res.json(docs);
    })
    .catch(e => {
      res.send(e);
    });
};

exports.list = function list(req, res, next) {
  if (req.query.id === "__today__") {
    return today(req, res);
  }
  var query = {
    user: req.query.id || req.user.sub
  };
  const { keyword } = req.query;

  if (keyword === "120+") {
    query.$or =[{ 'originRank': {$eq:-1}  }, { 'dynamicRank': {$eq:-1}  }];
  } else if (keyword === "+") {
    //字段比较
    query.$expr = {
      $lt: ["$dynamicRank", "$originRank"]
    };
    query.dynamicRank = {
      $gt: 0
    };
  } else if (keyword === "-") {
    query.$expr = {
      $gt: ["$dynamicRank", "$originRank"]
    };
  } else {
    if (keyword) {
      query.keyword = {
        $regex: ".*" + keyword + ".*"
      };
    }
  }

  console.log(query);
  Keyword.find(query, null, {
    limit: 1500,
    sort: {
      createDate: -1
    }
  })
    .then(docs => {
      res.json(docs);
    })
    .catch(e => {
      console.log(e);
    });
};

function customSplit(value) {
  var separators = ["\n"];
  var tokens = value.split(new RegExp(separators.join("|"), "g"));
  tokens = tokens.filter(function(val) {
    return val.trim().length > 1;
  });
  return tokens;
}

exports.create = function(req, res, next) {
  delete req.body._id;
  Promise.all([
    User.findOne({ userName: req.user.sub }),
    Keyword.find({ user: req.user.sub })
      .lean()
      .exec()
  ])
    .then(([user, docs]) => {
      var keywords = customSplit(req.body.keyword);

      //remove duplicate
      keywords = keywords.filter(function(item, pos) {
        return (
          keywords.indexOf(item) == pos &&
          docs.filter(x => {
            return x.link == req.body.link && x.keyword == item;
          }).length == 0
        );
      });

      //console.info("keywords", keywords);
      if (keywords.length == 0) {
        throw "重复或无效关键字";
      }
      if (keywords.length > dayMaxKeywords) {
        throw `保证更好的优好效果，系统当前规则设置用户每日提交关键词数量最高为${dayMaxKeywords}个，如果你需要优化更多关键词，请分批进行提交.`;
      }

      var newKeywords = [];
      for (var keyword of keywords) {
        newKeywords.push({
          link: req.body.link,
          keyword,
          createDate: new Date(), //必须传new date()进去，传Date.now()进去为double,传Date()进去为string
          originRank: 0,
          dynamicRank: 0,
          todayPolished: false,
          polishedCount: 0,
          user: req.user.sub,
          status: 1,
          engine: user.engine,
          tags: req.body.tags || [],
          shield: 0
        });
      }

      var grade = user.grade || 1;
      if (grade === 1) {
        var leftCount = 5 - docs.length;
        var tirmArray = newKeywords;
        if (leftCount > 0) {
          tirmArray = newKeywords.slice(leftCount);
        }
        tirmArray.map(x => {
          x.shield = 1;
          x.status = 2;
        });
      }
      return Keyword.collection.insertMany(newKeywords);
    })
    .then(docs => {
      res.json(docs.ops);
      // console.log("docs", docs); socket send notify for (var doc of docs.ops) {
      // req.socketServer.keywordCreate(doc); }
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

//更新tags
exports.keywordsTagUpdate = function(req, res, next) {
  console.log("req.body.tags", req.body.tags);
  Keyword.updateMany(
    {
      _id: {
        $in: req.body.id
      }
    },
    {
      tags: req.body.tags
    },
    { multi: true }
  )
    .then(docs => {
      res.json(docs);
    })
    .catch(e => {
      logger.error(e);
      return next(boom.badRequest(e));
    });
};

exports.update = function(req, res, next) {
  Keyword.findOne({ _id: req.params.id })
    .then(obj => {
      if (req.body.action == "reset") {
        obj.originRank = 0;
        obj.dynamicRank = 0;
        obj.status = 1;
        return obj.save();
      }
      if (req.body.action == "updateTag") {
        obj.tags = req.body.tags;
        return obj.save();
      }
      if (obj.originRank == -1 && obj.keyword != req.body.keyword) {
        obj.originRank = 0;
      }

      obj.keyword = req.body.keyword;
      obj.link = req.body.link;
      if (req.body.status) {
        obj.status = req.body.status;
        if (obj.status == 2) {
          console.log("emit keyword_pause");
          //notify cmd,data in order to send an event to everyone
          req.socketServer.keywordPause(req.user.sub, req.params.id);
        } else {
          if (obj.shield === 1) {
            //开启
            //非vip会员检查是否小于5个词，如果是小于则开启优化
            return Keyword.count({
              user: req.user.sub,
              status: 1,
              originRank: {
                $gt: 0
              }
            }).then(count => {
              console.log("count", count);
              if (count >= 5) {
                throw "非VIP会员开启失败";
              } else {
                obj.status = 1;
                return obj.save();
              }
            });
          }
          //
        }
      }
      return obj.save();
    })
    .then(doc => {
      res.json(doc);
    })
    .catch(e => {
      logger.error(e + "test");
      return next(boom.badRequest(e));
    });
};

exports.delete = function(req, res) {
  console.log("delete", req.params.id);
  var ids = req.params.id || req.body.ids;
  Keyword.deleteMany({
    _id: {
      $in: ids.split(",")
    }
  })
    .then(() => {
      res.send("delete ok");
    })
    .catch(e => {
      console.log(e);
      res.status(500);
      res.send(e);
    });
};

//scan job
exports.rank = function(req, res, next) {
  console.log("server rank  body", req.body);
  if (req.body.rank == null) return;
  var upinsert = {
    originRank: req.body.rank,
    dynamicRank: req.body.rank,
    engine: req.body.engine,
    isValid: req.body.rank != -1,
    lastPolishedDate: new Date(),
    polishedCount: 0,
    adIndexer: req.body.adIndexer || 0,
    resultIndexer: req.body.resultIndexer || 0
  };
  if (!req.body.title) {
    upinsert["title"] = req.body.title;
  }
  Keyword.findOneAndUpdate(
    {
      _id: req.body._id
    },
    upinsert,
    {
      //同时设置这2个参数，否则doc返回null
      new: true,
      upsert: true
    }
  )
    .then(doc => {
      //req.socketServer.refreshPage(doc);
      res.json(doc);
    })
    .catch(e => {
      return next(boom.badRequest(e));
    });
};

exports.tasks = function(req, res, next) {
  var ts = req.taskPool.taskRequest(req.user.sub);
  return res.json(ts);
};

exports.polish = function(req, res, next) {
  console.log("polish", req.body);
  if (req.body.rank == undefined) {
    res.send("invalid polish");
    return;
  }

  var setData = {
    dynamicRank: req.body.rank,
    lastPolishedDate: new Date()
  };

  if (time.isWorktime()) {
    setData["adIndexer"] = req.body.adIndexer || 0;
  }
  setData["resultIndexer"] = req.body.resultIndexer || 0;

  var upsertData = {
    $set: setData,
    $inc: {
      polishedCount: 1,
      todayPolishedCount: 1
    }
  };

  var lastDynamicRank = 0;

  Promise.all([
    Keyword.findOne({ _id: req.body._id }),
    User.findOne({ userName: req.user.sub })
  ])
    .then(([keyword, user]) => {
      if (!keyword) {
        throw "keyword not found";
      }
      lastDynamicRank = keyword.dynamicRank;
      if (user.locked) {
        throw `${req.user.sub},${keyword.keyword},black user exception`;
      }
      if (!keyword.originRank) {
        keyword.originRank = req.body.rank || -1;
      }
      if (keyword.originRank > 0 && req.body.rank == undefined) {
        throw keyword.keyword + ",skip rank=-1";
      }
      if (keyword.dynamicRank <= 80 && req.body.rank == -1) {
        throw keyword.keyword + ",skip rank=-1";
      }
      var hours = moment().diff(moment(keyword.createDate), "hours");
      console.log("hours", hours);
      if (hours < 24 && req.body.rank > keyword.dynamicRank) {
        throw `${req.user.sub},${keyword.keyword},24 error`;
      }
      if (
        hours >= 24 &&
        hours < 72 &&
        req.body.rank - keyword.dynamicRank > 5
      ) {
        throw `${req.user.sub},${keyword.keyword},72&5 error`;
      }
      return { keyword, user };
    })
    .then(result => {
      return Keyword.findOneAndUpdate(
        {
          _id: req.body._id
        },
        upsertData,
        {
          // 同时设置这2个参数，否则doc返回null
          upsert: true,
          new: true //return the modified document
          // rather than the original. defaults to false
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
        dynamicRank: doc.dynamicRank,
        lastDynamicRank,
        ip: ip
      });
      log.save();
      var obj = doc.toObject();
      req.socketServer.keywordPolish(obj);
      req.taskPool.taskEnd(req.user.sub, obj);
      res.json(doc);
    })
    .catch(e => {
      logger.error(e);
    });
};
