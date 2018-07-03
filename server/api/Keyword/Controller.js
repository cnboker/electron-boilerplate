'use strict'

var mongoose = require('mongoose'),
  Keyword = mongoose.model('Keyword');
var PolishLog = mongoose.model('PolishLog');
var User = mongoose.model('User');
var boom = require('boom')
var simpleStrategy = require('./taskSimpleStrategy')
var logger = require('../../logger')

exports.list = function (req, res) {
  //console.log('user name:', req.user.sub);
  Keyword.find({
      'user': req.user.sub
    }, null, {
      sort: {
        createDate: -1
      }
    },
    function (err, data) {
      if (err) {
        res.send(err)
        return;
      }
      res.json(data)
    })
}

exports.create = function (req, res, next) {
  delete req.body._id;
  User
    .findOne({
      'userName': req.user.sub
    })
    .then((user) => {
      return new Promise((resolve, reject) => {
        var grade = user.grade || 0;
        if (grade == 0) {
          //免费用户
          Keyword.count({
            'user': req.user.sub
          }).then(count => {
            if (count > 5) {
              reject('普通账号关键字数不能大于5个，请升级为标准账号')
            } else {
              resolve();
            }
          });
        } else {
          resolve();
        }
      })
    })
    .then(() => {
      return Keyword.find({
        'user': req.user.sub,
        'keyword': req.body.keyword,
        'link': req.body.link
      })
    })
    .then((docs) => {
      console.log(docs)
      if (docs.length > 0) {
        throw '关键字重复错误';
      } else {
        return true;
      }
    })
    .then(() => {
      var newKeyword = new Keyword({ ...req.body,
        createDate: Date.now(),
        originRank: 0,
        dynamicRank: 0,
        todayPolished: false,
        polishedCount: 0,
        user: req.user.sub,
        status: 1
      });
      return newKeyword.save();
    })
    .then((doc) => {
      res.json(doc)
      //socket send notify
      const taskio = req.app.io.of('/api/task');
      taskio.to(req.user.sub).emit('keyword_create', doc)
    })
    .catch((e) => {
      logger.error(e)
      return next(boom.badRequest(e));
    })

}

exports.read = function (req, res) {
  Keyword.findById(req.params.id, function (err, entity) {
    if (err) {
      res.send(err);
      return;
    }
    res.json(entity);
  });
}

exports.update = function (req, res) {

  Keyword.findOne({
    _id: req.params.id
  }, function (err, obj) {
    if (obj.originRank == -1 && obj.keyword != req.body.keyword) {
      obj.originRank = 0
    }

    const taskio = req.app.io.of('/api/task');

    obj.keyword = req.body.keyword;
    obj.link = req.body.link;
    if (req.body.status) {
      obj.status = req.body.status;
      if (obj.status == 2) {
        console.log('emit keyword_pause')
        //notify
        //cmd,data
        //in order to send an event to everyone
        taskio.emit('keyword_pause', {
          _id: req.params.id
        });

      }
    }

    if (obj.originRank == 0) {
      //私信给特定用户
      taskio.to(req.user.sub).emit('keyword_create', obj.toObject())
    }

    obj.save(function (err, doc) {
      if (err) {
        res.send(err);
        return;
      }
      res.json(doc);
    })
  })
}

exports.delete = function (req, res) {
  Keyword.remove({
    _id: req.params.id
  }, function (err, entity) {
    if (err) {
      res.send(err)
      return;
    }
    res.json({
      message: 'delete success'
    });
    const taskio = req.app.io.of('/api/task');
    taskio.emit('keyword_pause', {
      _id: req.params.id
    });
  })
}

//scan job
exports.rank = function (req, res) {
  console.log('server rank  body', req.body)
  Keyword.findOneAndUpdate({
    _id: req.body._id
  }, {
    originRank: req.body.rank,
    isValid: (req.body.rank != -1),
  }, {
    //同时设置这2个参数，否则doc返回null
    new: true,
    upsert: true
  }, function (err, doc) {
    console.log('server rank doc:', doc)
    if (err) {
      res.send(err);
      return;
    }
    res.json(doc);
  });
}

exports.tasks = function (req, res) {

  var inDoTasksTime = (() => {
    var startTime = 9 * 60;
    var endTime = 18 * 60 + 30;
    var d = new Date();
    var nowTime = d.getHours() * 60 + d.getMinutes();
    return nowTime > startTime && nowTime < endTime;
  })();
  if (!inDoTasksTime) return res.json([])

  //获取点数>0且今天未擦亮的关键字
  Keyword.find({
      isValid: true,
      status: 1
    },
    '_id keyword link' //only selecting the "_id" and "keyword" , "engine" "link"fields,
    ,
    function (err, docs) {
      if (err) {
        console.log('err', err)
        res.send(err);
        return;
      }

      //console.log('docs', docs)
      res.json(simpleStrategy(docs));
    })
}


//关键字擦亮结果处理
exports.polish = function (req, res) {
  var upsertData = {
    $set: {
      dynamicRank: req.body.rank,
      lastPolishedDate: new Date(),
    },
    $inc: {
      polishedCount: 1
    }
  };
  Keyword.findOneAndUpdate({
      _id: req.body._id
    }, upsertData, {
      //同时设置这2个参数，否则doc返回null
      upsert: true,
      new: true //return the modified document rather than the original. defaults to false
    },
    function (err, doc) {
      if (err) {
        res.send(err);
        return;
      }
      console.log('polish................', doc)
      res.json(doc);
    });

  var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  var log = new PolishLog({
    keyword_id: req.body._id,
    user: req.user.sub,
    createDate: Date.now(),
    ip: ip
  })
  log.save();

}