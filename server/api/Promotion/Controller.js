var moment = require("moment");
var boom = require("boom");

var Promotion = require("./Model");
var User = require('../User/Model')
/*
记录点击URL的参数
pramams:rewardCode, ip
*/
exports.trace = function (req, res, next) {
  var id = req.body.id;
  var ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  Promise.all([
    User.findOne({_id: id}),
    Promotion.findOne({ip})
  ]).then(([user, p]) => {
    if (!user) 
      return;
    if (!p) {
      p = {
        userId: id,
        rewardCode: user.rewardCode,
        ip,
        createDate: new Date(),
        action: 1
      };
      return Promotion
        .collection
        .insert(p)

    }
  }).then(() => {
    res.send('ok')
  }).catch(e => {
    return next(boom.badRequest(e));
  });
}
/*
用户注册通过IP换回推荐码,没有返回空
*/
exports.reqRewardCode = function (req, res, next) {
  var ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;

  Promotion
    .findOne({ip})
    .then(doc => {
      doc = doc || {rewardCode:''};
      res.json(doc);
    })
    .catch(e => {
      return next(boom.badRequest(e));
    });
};
