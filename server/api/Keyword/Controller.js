'use strict'

var mongoose = require('mongoose'),
  Keyword = mongoose.model('Keyword');
var PolishLog = mongoose.model('PolishLog');

exports.list = function (req, res) {
  //console.log('user name:', req.user.sub);
  Keyword.find({
    'user': req.user.sub
  }, function (err, data) {
    if (err) {
      res.send(err)
      return;
    }
    res.json(data)
  })
}

exports.create = function (req, res) {
  delete req.body._id;
  var newKeyword = new Keyword({ ...req.body,
    createDate: Date.now(),
    originRank: 0,
    dynamicRank: 0,
    todayPolished: false,
    polishedCount: 0,
    user: req.user.sub,
    status: 1
  });
  newKeyword.save(function (err, entity) {
    if (err) {
      res.send(err);
      return;
    }
    if (entity) {
      res.json(entity);
    }
  });
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
  // Keyword.findOneAndUpdate({
  //   _id: req.params.id
  // }, req.body, {
  //   new: true
  // }, function (err, entity) {
  //   if (err) {
  //     res.send(err);
  //     return;
  //   }
  //   res.json(entity);
  // });
  Keyword.findOne({
    _id: req.params.id
  }, function (err, obj) {
    if (obj.originRank == -1 && obj.keyword != req.body.keyword) {
      obj.originRank = 0
    }
    obj.keyword = req.body.keyword;
    obj.link = req.body.link;
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
  })
}

//scan job
exports.rank = function (req, res) {
  //console.log('server rank  body', req.body)
  Keyword.findOneAndUpdate({
    _id: req.body._id
  }, {
    originRank: req.body.rank,
    isValid: (req.body.rank != -1),
  }, {
    new: true
  }, function (err, entity) {
    console.log('server err:', err)
    if (err) {
      res.send(err);
      return;
    }
    res.json(entity);
  });
}

exports.tasks = function (req, res) {
  var inDoTasksTime = (() => {
    var startTime = 9 * 60;
    var endTime = 16 * 60 + 30;
    var d = new Date();
    var nowTime = d.getHours() * 60 + d.getMinutes();
    return nowTime > startTime && nowTime < endTime;
  })();
  if (!inDoTasksTime) return res.json([])
  //获取点数>0且今天未擦亮的关键字
  Keyword.find({
      isValid: true,
      status: 1,
      todayPolishedCount: {
        $lt: everyDayMaxPolishedCount
      }
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
      res.json(docs);
    })
}

//暂停关键字擦亮
exports.status = function (req, res) {
  Keyword.findOneAndUpdate({
      _id: req.body._id
    }, {
      status: req.status //
    }, {
      new: false
    },
    function (err, doc) {
      if (err) {
        res.send(err);
        return;
      }
      res.json(doc)
    }
  );
  //notify
  //cmd,data
  //this==app?
  //in order to send an event to everyone
  this.io.emit('keyword_pause', {
    _id: req.body._id
  });

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