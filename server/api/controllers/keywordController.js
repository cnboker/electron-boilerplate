'use strict'

var mongoose = require('mongoose'),
  Keyword = mongoose.model('Keyword');

exports.list = function (req, res) {
  Keyword.find({
    'user': 'scott'
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
    todayPolished: false
  });
  newKeyword.save(function (err, entity) {
    if (err) {
      res.send(err);
    }


    res.json(entity);
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