"use strict";

var boom = require("boom");
var moment = require("moment");

var Models = require('./Model')
var Question = Models.Question;
var Answer = Models.Answer;
var Comment = Models.Comment;

exports.read = function (req, res, next) {
  Answer
    .findOne({_id: req.params.id})
    .then(doc => {
      res.json(doc)
    })
    .catch(e => {
      return next(boom.badRequest(e))
    })
}

exports.create = function (req, res, next) {
  //console.log('req.body',req.body)
  var doc = Answer({author: req.user.sub, content: req.body.content, question_id: req.body.question_id, create_at: new Date(), vpvotes: 0});
  doc
    .save()
    .then(doc => {
      res.json(doc);
    })
    .catch(e => {
      return next(boom.badRequest(e));
    });
};

exports.del = function (req, res, next) {
  Promise.all([
    Answer.findOneAndRemove({_id: req.params.id}),
    Comment.deleteMany({commentable_id: req.params.id})
  ]).then(([q, a]) => {
    console.log('q',q)

    res.json(q)
  }).catch(e => {
    return next(boom.badRequest(e));
  })
}
