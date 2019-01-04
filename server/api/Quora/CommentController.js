"use strict";

var boom = require("boom");
var moment = require("moment");

var Comment = require("./Model").Comment;

exports.create = function (req, res, next) {
  //console.log('req.body',req.body)
  var doc = Comment({
    author: req.user.sub, content: req.body.content, commentable_id: req.body.commentable_id, //评论主体
    commentable_type: req.body.commentable_type || 'Answer',
    create_at: new Date(),
    question_id: req.body.question_id
  });
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
  Comment
    .findOneAndDelete({_id: req.params.id})
    .then(doc => {
      res.json(doc);
    })
    .catch(e => {
      return next(boom.badRequest(e));
    });
};
