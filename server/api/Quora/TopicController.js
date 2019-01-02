"use strict";

var boom = require("boom");
var moment = require("moment");
var Model = require('./Model')
var Topic = Model.Topic;
var Question = Model.Question;
var cache = require('memory-cache')
const expiredTime = 1000;
const topicCloudKey = "topicCloud"

exports.cloud = function (req, res, next) {
  var map = cache.get(topicCloudKey)
  if (map) {
    res.json(map)
    return;
  }
  Question
    .find({})
    .then(docs => {
      var map = docs.reduce((map, item) => {
        if (item.topics) {
          item
            .topics
            .map(x => {
              if (!map[x]) {
                map[x] = 1;
              } else {
                map[x] += 1;
              }
            })
        }
        return map;
      }, {})
      var result = []
      Object
        .keys(map)
        .map(x => {
          result.push({value: x, count: map[x]})
        })
      cache.put(topicCloudKey, result, expiredTime)
      console.log('cloud', result)
      res.json(result)
    })
}

exports.list = function (req, res, next) {
  Topic.find({}, null, {
    sort: {
      create_at: -1
    }
  }).then(docs => {
    res.json(docs.map(x => x.name));
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
    .map(x => x.value);
  Topic
    .find()
    .lean()
    .exec()
    .then(async docs => {
      var saveTopics = docs.map(item => {
        return item.name;
      })
      var newTopics = topics.filter((item, pos) => {
        return topics.indexOf(item) == pos && !saveTopics.includes(item);
      })

      var deleteTopics = saveTopics.filter(item => {
        return !topics.includes(item)
      })
      var newTopicModel = []
      for (var topic of newTopics) {
        newTopicModel.push({name: topic, create_at: new Date()})
      }
      console.log('debug', newTopicModel, deleteTopics)
      if(deleteTopics.length > 0){
        await Topic.deleteMany({
          name: {
            $in: deleteTopics
          }
        })
      }
      if(newTopicModel.length > 0){
        await Topic
        .collection
        .insertMany(newTopicModel)
      }
      return "ok"
    })
    .then(() => res.send('ok'))
    .catch(e => {
      return next(boom.badRequest(e))
    })

};
