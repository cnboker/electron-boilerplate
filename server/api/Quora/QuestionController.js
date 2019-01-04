"use strict";

var boom = require("boom");
var moment = require("moment");

var Models = require('./Model')
var Question = Models.Question;
var Answer = Models.Answer;
var Comment = Models.Comment;

exports.list = function (req, res, next) {
  var query = {};
  if(req.query.topic){
    query ={
      topics:req.query.topic
    }
  }
  Promise.all([
    Answer.aggregate([
      {
        $group: {
          _id: '$question_id',
          count: {
            $sum: 1
          }
        }
      }
    ]),
    Question.find(query, null, {
      sort: {
        create_at: -1
      }
    })
  ]).then(([ag, qs]) => {
    var agJson = ag.reduce((map, doc) => {
      map[doc._id] = doc.count;
      return map;
    }, {})
    console.log('doc', agJson)
    var result = qs.reduce((map, doc) => {
      map[doc._id] = {
        ...doc.toObject(),
        answerCount: agJson[doc._id]
      }
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
      .exec(),
    Comment
      .find({question_id: req.params.id})
      .lean()
      .exec()
  ]).then(([question, answers, comments]) => {
    var doc = question.toObject();
    if (answers) {
      doc.answers = answers.reduce((map, obj) => {
        map[obj._id] = obj;
        obj.comments = comments.filter((comment) => {
          return comment
            .commentable_id
            .toString() == obj
            ._id
            .toString();
        }).reduce((map, obj) => {
          map[obj._id] = obj;
          return map;
        }, {})
        return map;
      }, {});
    }
    console.log('question:',doc);
    res.json(doc)
  }).catch(e => {
    return next(boom.badRequest(e))
  })
}

exports.create = function (req, res, next) {
  //console.log('req.body',req.body)
  var doc = Question({
    author: req.user.sub,
    title: req.body.title,
    description: req.body.description,
    create_at: new Date(),
    vpvotes: 0,
    topics: req.body.topics
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
