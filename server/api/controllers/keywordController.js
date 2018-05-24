'use strict'

var mongoose = require('mongoose'),
  Keyword = mongoose.model('Keyword');

exports.list = function (req, res) {
  Keyword.find({
    'user': 'scott'
  }, function (err, data){
    if (err) {
      res.send(err)
    }
    res.json(data)
  })
}

exports.create = function (req, res) {
  var newKeyword = new Keyword(req.body);
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
    Task.findOneAndUpdate({
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