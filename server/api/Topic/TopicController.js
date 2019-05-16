"use strict";

var boom = require("boom");
var moment = require("moment");
var Topic = require('./Model')

exports.list = function (req, res, next) {
  Topic.find({
    userName: req.user.sub,
    catelog: req.params.id
  }, null, {
    sort: {
      create_at: -1
    }
  }).then(docs => {
    res.json(docs.map(x => x.topic));
  }).catch(e => {
    return next(boom.badRequest(e));
  });
};

exports.read = function (req, res, next) {
  Question
    .findOne({_id: req.params.id})
    .then(doc => {
      res.json(doc)
    })
    .catch(e => {
      return next(boom.badRequest(e))
    })
}

exports.update = function (req, res, next) {
  console.log('req.body', req.body)
  var topics = req
    .body
    .topic
    .map(x => x.value);

  Topic
    .find({userName: req.user.sub, catelog: req.body.catelog})
    .lean()
    .exec()
    .then(async saveTopics => {

      var newTopics = topics.filter((topic, pos) => {
        return topics.indexOf(topic) == pos && !saveTopics
          .map(x => x.topic)
          .includes(topic);
      }).map(topic => {
        return {catelog: req.body.catelog, topic, create_at: new Date, userName: req.user.sub}
      })

      var deleteTopics = saveTopics.filter(item => {
        return !topics.includes(item.topic)
      })

      if (deleteTopics.length > 0) {
        await Topic.deleteMany({
          _id: {
            $in: deleteTopics.map(x => x._id)
          }
        })
      }
      if (newTopics.length > 0) {
        await Topic
          .collection
          .insertMany(newTopics)
      }
      return "ok"
    })
    .then(() => res.send('ok'))
    .catch(e => {
      return next(boom.badRequest(e))
    })

};
