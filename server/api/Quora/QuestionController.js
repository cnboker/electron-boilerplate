"use strict";

var boom = require("boom");
var moment = require("moment");

var Models = require('./Model')
var Question = Models.Question;
var Answer = Models.Answer;
var Comment = Models.Comment;
exports.list = function (req, res, next) {
  Question.find({}, null, {
    sort: {
      create_at: -1
    }
  }).then(docs => {
    var result = docs.reduce((map, doc) => {
      map[doc._id] = doc
      return map;
    }, {})
    res.json(result);
  }).catch(e => {
    return next(boom.badRequest(e));
  });
};

exports.read = function (req, res, next) {
  Promise.all([
    Question.findOne({_id: req.params.id}),
    Answer
      .find({question_id: req.params.id})
      .lean()
      .exec()
  ]).then(([question, answers]) => {
    var doc = question.toObject();
    doc.answers = answers.reduce((map, obj) => {
      map[obj._id] = obj;
      return map;
    }, {});
    //console.log('question:',doc);
    res.json(doc)
  }).catch(e => {
    return next(boom.badRequest(e))
  })
}

exports.create = function (req, res, next) {
  //console.log('req.body',req.body)
  var doc = Question({author: req.user.sub, title: req.body.title, description: req.body.description, create_at: new Date(), vpvotes: 0});
  doc
    .save()
    .then(doc => {
      res.json(doc);
    })
    .catch(e => {
      return next(boom.badRequest(e));
    });
};

exports.update = function (req, res, next) {
  Question
    .findOne({_id: req.params.id})
    .then(doc => {
      doc.title = req.body.title;
      doc.description = req.body.description;
      doc.update_at = new Date();
      return doc.save();
    })
    .then(doc => {
      res.json(doc)
    })
    .catch(e => {
      return next(boom.badRequest(e))
    })
}

exports.del = function (req, res, next) {
  Promise.all([
    Question.remove({_id: req.params.id}),
    Answer.deleteMany({question_id: req.params.id}),
    Comment.deleteMany({question_id: req.params.id})
  ]).then(([q, a, c]) => {
    res.json(q)
  }).catch(e => {
    return next(boom.badRequest(e));
  });
};
