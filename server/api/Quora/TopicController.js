"use strict";

var boom = require("boom");
var moment = require("moment");

var Question = require("./Model").Question;

exports.list = function(req, res, next) {
  Question.find(
    {
    },
    null,
    {
      sort: {
        create_at: -1
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

exports.read = function(req,res,next){
  Question.findOne({
    _id:req.params.id
  }).then(doc=>{
    res.json(doc)
  }).catch(e=>{
    return next(boom.badRequest(e))
  })
}

exports.create = function(req, res, next) {
    //console.log('req.body',req.body)
  var doc = Question({
    author:req.user.sub,
    title:req.body.title,
    description:req.body.description,
    create_at:new Date(),
    vpvotes:0
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

exports.update = function(req,res,next){
  Question.findOne({
    _id:req.params.id
  }).then(doc=>{
    doc.title = req.body.title;
    doc.description = req.body.description;
    doc.update_at = new Date();
    return doc.save();
  })
  .then(doc=>{
    res.json(doc)
  })
  .catch(e=>{
    return next(boom.badRequest(e))
  })
}

exports.del = function(req, res,next) {
  Question.remove({
    _id: req.params.id
  })
    .then(doc => {
      res.json(doc);
    })
    .catch(e => {
      return next(boom.badRequest(e));
    });
};
