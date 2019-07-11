var moment = require("moment");
var boom = require("boom");

var Promotion = require("./Model");

/*
记录点击URL的参数
pramams:rewardCode, ip
*/
exports.trace = function(req, res, next) {
  Promotion.findOne({ rewordCode: req.params.id })
    .then(doc => {
      if (!doc) { 
        var ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
        doc = {
          rewordCode: req.params.id,
          ip,
          createDate: new Date()
        };
        Promotion.collection.insert(doc).then(doc => {
          res.json(doc);
        });
      }
    })
    .catch(e => {
      return next(boom.badRequest(e));
    });
};

/*
用户注册通过IP换回推荐码,没有返回空
*/
exports.reqRewardCode = function(req, res, next) {
  var ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;

  Promotion.findOne({
    ip
  })
    .then(doc => {
      res.json(doc);
    })
    .catch(e => {
      return next(boom.badRequest(e));
    });
};
