"use strict";

var boom = require("boom");
var moment = require("moment");

var Keyword = require("./Model");
var PolishLog = require("./PolishlogModel");
var User = require("../User/Model");

var simpleStrategy = require("./taskSimpleStrategy");
var logger = require("../../logger");
var keywordPool = require("../../socket/keywordPool");
var time = require("../../utils/time");

exports.finishedPool = function (req, res) {
  return res.json(keywordPool.finishedPool);
};

exports.sharePool = function (req, res) {
  return res.json(keywordPool.sharePool);
};

exports.userPool = function (req, res) {
  return res.json(keywordPool.userPool);
};

var today = exports.today = function (req, res) {
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
  Keyword
    .find({
    createDate: {
      $gt: start,
      $lt: end
    }
  })
    .sort({createDate: -1})
    .exec()
    .then(docs => {
      res.json(docs);
    })
    .catch(err => {
      res.send(err);
    });
};

exports.history = function (req, res) {
  PolishLog
    .find({
      keyword_id: req.params.id
    }, "dynamicRank createDate", {
      sort: {
        createDate: 1
      }
    }, function (err, data) {
      if (err) {
        res.send(err);
        return;
      }
      res.json(data);
    });
};

exports.websiteOfkeywords = function (req, res, next) {
  Keyword.aggregate([
    {
      $match: {
        user: req.user.sub
      }
    }, {
      $group: {
        _id: '$link',
        count: {
          $sum: 1
        }
      }
    }
  ]).then(docs => {
    res.json(docs)
  })
}
//获取没有初始排名数据
exports.unRankKeywords = function (req, res) {
  Keyword
    .find({user: req.user.sub, originRank: 0})
    .then(docs => {
      res.json(docs);
    })
    .catch(e => {
      res.send(e);
    });
};

exports.list = function list(req, res, next) {
  console.log('req.query',req.query)
  if(req.query.id === '__today__'){
    return today(req,res);
  }
  var query = {
    user: req.query.id || req.user.sub
  }
  console.log(query)
  Keyword
    .find(query, null, {
    sort: {
      createDate: -1
    }
  })
    .then(docs => {
      res.json(docs)
    })
    .catch(e => {
      console.log(e)
    })

}

function customSplit(value) {
  var separators = [" ", "\n", ","];
  var tokens = value.split(new RegExp(separators.join("|"), "g"));
  tokens = tokens.filter(function(val) {
    return val.trim().length > 1;
  });
  return tokens;
}

exports.create = function (req, res, next) {
  delete req.body._id;
  Promise.all([
    User.findOne({userName: req.user.sub}),
    Keyword
      .find({user: req.user.sub})
      .lean()
      .exec()
  ]).then(([user, docs]) => {
  
    var keywords = customSplit(req
      .body
      .keyword)
     
    //remove duplicate
    keywords = keywords.filter(function (item, pos) {
      return (keywords.indexOf(item) == pos && docs.filter(x => {
        return x.link == req.body.link && x.keyword == item;
      }).length == 0);
    });

    console.info("keywords", keywords);
    if (keywords.length == 0) {
      throw "重复或无效关键字";
    }

    var grade = user.grade || 1;
    var hours = moment().diff(moment(user.vipExpiredDate), "hours");
    if (grade == 1 || hours > 0) {
      if (docs.length + keywords.length > 5) {
        throw "你提交的关键词已超出限制。免费版用户默认提交关键词数量为5个。你可以通过持续使用本工具，随着使用时长，系统会自动增加可提交关键词数量。当然，现在升级VIP用户，" +
          "马上就能提交更多关键词";
      }
      var exists = docs.filter(function (doc) {
        return doc.link == req.body.link;
      });
      if (docs.length > 0 && exists.length == 0) {
        throw "普通账号只能增加一个域名";
      }
    }
    if (keywords.length == 0) {
      throw "没有可用关键字";
    }

    console.info("keywords ---", keywords);

    var docs = [];
    for (var keyword of keywords) {
      docs.push({
        link: req.body.link, keyword, createDate: new Date(), //必须传new date()进去，传Date.now()进去为double,传Date()进去为string
        originRank: 0,
        dynamicRank: 0,
        todayPolished: false,
        polishedCount: 0,
        user: req.user.sub,
        status: 1,
        engine: user.engine
      });
    }
    return Keyword
      .collection
      .insertMany(docs);
  }).then(docs => {
    res.json(docs.ops);
    // console.log("docs", docs); socket send notify for (var doc of docs.ops) {
    // req.socketServer.keywordCreate(doc); }
  }).catch(e => {
    logger.error(e);
    return next(boom.badRequest(e));
  });
};

exports.read = function (req, res) {
  Keyword
    .findById(req.params.id, function (err, entity) {
      if (err) {
        res.send(err);
        return;
      }
      res.json(entity);
    });
};

exports.update = function (req, res, next) {
  Keyword
    .findOne({_id: req.params.id})
    .then(obj => {
      if (req.body.action == "reset") {
        obj.originRank = 0;
        obj.dynamicRank = 0;
        obj.status = 1;
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
          req
            .socketServer
            .keywordPause(req.user.sub, req.params.id);
        }
      }
      return obj.save();
    })
    .then(doc => {
      res.json(doc);
    })
    .catch(e => {
      logger.error(e);
      return next(boom.badRequest(e));
    });
};

exports.delete = function (req, res) {
  Keyword
    .deleteMany({
    _id: {
      $in: req
        .params
        .id
        .split(',')
    }
  })
    .then(() => {
      res.send('delete ok')
    })
    .catch(e => {
      res.status(500)
      res.send(e)
    })

};

//scan job
exports.rank = function (req, res, next) {
  console.log("server rank  body", req.body);
  if (req.body.rank == null) 
    return;
  var upinsert = {
    originRank: req.body.rank,
    dynamicRank: req.body.rank,
    engine: req.body.engine,
    isValid: req.body.rank != -1,
    lastPolishedDate: new Date(),
    polishedCount: 0,
    adIndexer: req.body.adIndexer || 0
  };
  if (!req.body.title) {
    upinsert["title"] = req.body.title;
  }
  Keyword.findOneAndUpdate({
    _id: req.body._id
  }, upinsert, {
    //同时设置这2个参数，否则doc返回null
    new: true,
    upsert: true
  }).then(doc => {
    //req.socketServer.refreshPage(doc);
    res.json(doc);
  }).catch(e => {
    return next(boom.badRequest(e));
  });
};

exports.tasks = function (req, res, next) {
  return res.json(keywordPool.reqTask(req.user.sub));
};

exports.tasksv1 = function (req, res, next) {
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
    User.find({locked: true}),
    User.findOne({userName: req.user.sub})
  ]).then(([blackUsers, currentUser]) => {
    var names = blackUsers.map(x => {
      return x.userName;
    });
    return Keyword.find({
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
    }, "_id user originRank dynamicRank keyword link", { //only selecting the "_id" and "keyword" , "engine" "link"fields,
        sort: {
          createDate: -1
        }
      })
      .lean()
      .exec();
  }).then(docs => {
    logger.info("exports.tasks docs", docs);
    res.json(simpleStrategy(docs));
    var hrend = process.hrtime(hrstart);
    console.info("Execution time (hr): %ds %dms", hrend[0], hrend[1] / 1000000);
  }).catch(e => {
    return
    next(boom.badRequest(e));
  });
};

exports.polish = function (req, res, next) {
  console.log("polish", req.body);
  if (req.body.rank == undefined) {
    res.send("invalid polish");
    return;
  }
  var updateData = {
    lastPolishedDate: new Date()
  };

  if (time.isWorktime()) {
    updateData["adIndexer"] = req.body.adIndexer || 0;
  }

  if (req.body.opt === "localScan") {
    updateData.dynamicRank = req.body.rank;
    if (req.body.title) {
      updateData.title = req.body.title;
    }
    console.info("polish updatedate---------", updateData);
    var upsertData = {
      $set: updateData
    };
    Keyword.findOneAndUpdate({
      _id: req.body._id
    }, upsertData, {
      // 同时设置这2个参数，否则doc返回null
      upsert: true, new: true //return the modified document
      // rather than the original. defaults to false
    }).then(doc => {
      console.log("localscan", doc);
      var ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
      var log = new PolishLog({
        keyword_id: req.body._id,
        user: req.user.sub,
        keyword: doc.keyword,
        createDate: new Date(),
        dynamicRank: doc.dynamicRank,
        ip: ip
      });
      log.save();
      res.json(doc);
    });
  } else {
    // Keyword.findOne({ _id: req.body._id }).then(doc => {
    // keywordPool.polishFinished(req.user.sub, doc.toObject()); });
    dynamicPolish(req, res, next);
  }
};

//关键字擦亮结果处理
function dynamicPolish(req, res, next) {
  var upsertData = {
    $set: {
      dynamicRank: req.body.rank,
      lastPolishedDate: new Date()
    },
    $inc: {
      polishedCount: 1,
      todayPolishedCount: 1
    }
  };

  if (time.isWorktime()) {
    upsertData["adIndexer"] = req.body.adIndexer || 0;
  }

  var lastDynamicRank = 0;
  Promise.all([
    Keyword.findOne({_id: req.body._id}),
    User.findOne({userName: req.user.sub})
  ]).then(([keyword, user]) => {
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
    if (hours >= 24 && hours < 72 && req.body.rank - keyword.dynamicRank > 5) {
      throw `${req.user.sub},${keyword.keyword},72&5 error`;
    }
    return {keyword, user};
  }).then(result => {
    
    return Keyword.findOneAndUpdate({
      _id: req.body._id
    }, upsertData, {
      // 同时设置这2个参数，否则doc返回null
      upsert: true, new: true //return the modified document
      // rather than the original. defaults to false
    });
  })
    .then(function (doc) {
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
      req
        .socketServer
        .keywordPolish(obj);
      keywordPool.polishFinished(req.user.sub, obj);
      res.json(doc);
    })
    .catch(e => {
      logger.error(e);
    });
}