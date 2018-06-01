'use strict'

var mongoose = require('mongoose'),
  Keyword = mongoose.model('Keyword');

exports.list = function (req, res) {
  //console.log('user name:', req.user);
  Keyword.find({
    'user': req.user.sub
  }, function (err, data) {
    if (err) {
      res.send(err)
    }
    res.json(data)
  })
}

exports.create = function (req, res) {
  delete req.body._id;
  var newKeyword = new Keyword({ ...req.body,
    createDate: Date.now(),
    systemPage: 0,
    dynamicPage: 0,
    todayPolished: false,
    polishedCount: 0
  });
  newKeyword.save(function (err, entity) {
    if (err) {
      res.send(err);
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
    }
    res.json(entity);
  });
}

exports.update = function (req, res) {
  Keyword.findOneAndUpdate({
    _id: req.params.id
  }, req.body, {
    new: true
  }, function (err, entity) {
    if (err) {
      res.send(err);
    }
    res.json(entity);
  });
}

exports.delete = function (req, res) {
  Keyword.remove({
    _id: req.params.id
  }, function (err, entity) {
    if (err) {
      res.send(err)
    }
    res.json({
      message: 'delete success'
    });
  })
}

//update systemPage
exports.rank = function (req, res) {

  Keyword.findOneAndUpdate({
    _id: res.body._id
  }, {
    systemPage: res.body.rank,
    dynamicPage: res.body.rank,
    isValid: res.body.rank != -1
  }, {
    new: true
  }, function (err, entity) {
    if (err) {
      res.send(err);
    }
    res.json(entity);
  });
}

exports.tasks = function (req, res) {
  //获取点数>0且今天未擦亮的关键字
  Keyword.find({}, 
    '_id keyword engine link' //only selecting the "_id" and "keyword" , "engine" "link"fields,
  , function (err, docs) {
    if (err) {
      console.log('err',err)
      res.send(err);
    }
    console.log('docs', docs)
    res.json(docs);
  })
}

//关键字擦亮结果处理
exports.polish = function (req, res) {
  Keyword.findOneAndUpdate({
    _id: res.body._id
  }, {
    dynamicPage: res.body.rank,
    todayPolished: true,
    lastPolishedDate: new Date()
  }, {
    new: true
  }, function (err, entity) {
    if (err) {
      res.send(err);
    }
    res.json(entity);
  });
}