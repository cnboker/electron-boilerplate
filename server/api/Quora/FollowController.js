"use strict";

var boom = require("boom");
var moment = require("moment");

var Follow = require("./Model").Follow;

exports.list = function(req, res, next) {
  Follow.find(
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
  Follow.findOne({
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


