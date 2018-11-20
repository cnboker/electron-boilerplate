"use strict";

var boom = require("boom");
var moment = require("moment");

var Event = require("./Model");

exports.list = function(req, res, next) {
  Event.find(
    {
      keyword_id: req.params.id
    },
    null,
    {
      sort: {
        createDate: -1
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

exports.create = function(req, res, next) {
    delete req.body._id;
    //console.log('req.body',req.body)
  var doc = Event(req.body);
  doc
    .save()
    .then(doc => {
      res.json(doc);
    })
    .catch(e => {
      return next(boom.badRequest(e));
    });
};

exports.del = function(req, res,next) {
  Event.remove({
    _id: req.params.id
  })
    .then(doc => {
      res.json(doc);
    })
    .catch(e => {
      return next(boom.badRequest(e));
    });
};
