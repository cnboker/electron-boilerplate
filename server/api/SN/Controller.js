var boom = require('boom')
var moment = require('moment')
var ph = require('../../utils/passwordHash')
var SN = require('./Model')
var User = require('../User/Model')
var Balance = require('../Balance/Model')
exports.list = function (req, res, next) {
  SN.find({
    userName: req.params.id
  }, null, {
    sort: {
      createDate: -1
    }
  }).then(docs => {
    res.json(docs)
  }).catch(e => {
    return next(boom.badRequest(e))
  })
}

exports.snCreate = function (req, res, next) {
  var docs = [];
  for (var i = 0; i < + req.body.snCount; i++) {
    var doc =  {
      userName: req.body.userName,
      mobile: req.body.mobile,
      idCard: req.body.idCard,
      address: req.body.address,
      gender: req.body.gender,
      sn: ph.radmon(6),
      createDate: new Date(),
      actived: 0,
      isPaid: 0,
      price: req.body.price,
      payPrice: req.body.payPrice
    }
    docs.push(doc)
  }

  SN
    .collection
    .insertMany(docs)
    .then(docs => {
      res.json(docs.ops)
    })
    .catch(e => {
      return next(boom.badRequest(e))
    })

}

exports.snActivate = function (req, res, next) {
  Promise.all([
    SN.findOne({sn: req.body.sn}),
    User.findOne({userName: req.user.sub})
  ]).then(([sn, user]) => {
    if(!sn){
      throw `sn '${req.body.sn}' 不存在`
    }
    if (sn.actived == 1) {
      throw `${req.body.sn}已被使用,激活失败`
    }
    sn.actived = 1;
    sn.activedUser = req.user.sub;
    sn.activedDate = new Date();
    sn.save();

    var serviceDays = 30;
    var balance = new Balance({
      user: req.body.userName,
      amount: sn.price,
      createDate: new Date(),
      serviceDate: user.vipExpiredDate || new Date(),
      days: serviceDays,
      remark: `vip充值金额${sn.price}`
    });
    balance.save()

    user.grade = 2;
    user.upgradeGradeDate = new Date();
    user.vipExpiredDate = moment(user.vipExpiredDate || new Date()).add(serviceDays, 'days')
    return user.save()
  }).then(doc => {
    res.json(doc)
  }).catch(e => {
    console.log(e)
    return next(boom.badRequest(e))
  })

}
