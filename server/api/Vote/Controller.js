"use strict";

var boom = require("boom");
var moment = require("moment");

var Vote = require("./Model");
var QuoraModel = require('../Quora/Model')
var User = require('../User/Model')

exports.read = function (req, res, next) {
  console.log('req.param.id', req.params.id)
  Promise.all([
    QuoraModel
      .Answer
      .find({
        question_id: req.params.id
      }, "_id", {})
      .lean()
      .exec(),
    QuoraModel
      .Comment
      .find({
        question_id: req.params.id
      }, "_id", {})
      .lean()
      .exec()
  ]).then(([aids, bids]) => {
    return [
      ...aids,
      ...bids
    ].map(x => x._id)
  }).then(ids => {
    console.log('catch..catch.', ids)
    if (ids.length == 0) 
      return [];
    return Vote.find({
      object_id: {
        $in: ids
      }
    })
  }).then(docs => {
    var result = docs.reduce((map, doc) => {
      map[doc.object_id] = doc;
      return map;
    }, {})
    res.json(result);
  }).catch(e => {
    return next(boom.badRequest(e));
  });

};

exports.create = function (req, res, next) {
  var like = (+ req.body.like || 0) >= 1
    ? 1
    : 0;
  var dislike = (+ req.body.dislike || 0) >= 1
    ? 1
    : 0;
  var love = (+ req.body.love || 0) >= 1
    ? 1
    : 0;
  var object_id = req.body.object_id;
  var updateVote = {
    like,
    dislike,
    love
  }
  User
    .findOne({userName: req.user.sub})
    .then(user => {
      console.log('user',user)
      var userVotes = {}
      if (user.votes) {
        userVotes = JSON.parse(user.votes)
      }
      var userVote = userVotes[object_id];
      if (!userVote) {
        userVotes[object_id] = updateVote;
      } else {
        if (userVote.like + like > 1) {
          throw 'repeat like'
        }
        if (userVote.dislike + dislike > 1) {
          throw 'repeat dislike'
        }
        if (userVote.love + love > 1) {
          throw 'repeat love'
        }
        userVote.love = love;
        if (userVote.like === 1 && dislike === 1) {
          userVote.like = 0
          userVote.dislike = 1;
          updateVote.like = -1;
          updateVote.dislike = 1;
        }
        if (userVote.dislike === 1 && like === 1) {
          userVote.dislike = 0;
          userVote.like = 1;
          updateVote.like = 1;
          updateVote.dislike = -1;
        }
      }
      user.votes = JSON.stringify(userVotes)
      return user.save();
    })
    .then(() => {
      var upsertData = {
        $inc: updateVote
      }
      Vote.findOneAndUpdate({
        object_id: req.body.object_id
      }, upsertData, {
        upsert: true,
        new: true
      }).then(doc => {
        res.json(doc);
      })
    })
    .catch(e => {
      return next(boom.badRequest(e));
    });

};
