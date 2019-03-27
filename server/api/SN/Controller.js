var boom = require("boom");
var moment = require("moment");
var ph = require("../../utils/passwordHash");
var SN = require("./Model");
var User = require("../User/Model");
var Balance = require("../Balance/Model");
var Keyword = require("../Keyword/Model");
var config = require('../../config')
var balanceService = require('../Balance/Service')

exports.agent = function (req, res, next) {
  SN
    .findOne({userName: req.params.id})
    .then(doc => {
      res.json(doc);
    })
    .catch(e => {
      return next(boom.badRequest(e));
    });
};

exports.list = function (req, res, next) {
  var query = {};

  query.createDate = {
    $gt: req.query.startDate,
    $lt: req.query.endDate
  };
  if (req.query.name) {
    query.userName = {
      $regex: ".*" + req.query.name + ".*",
      $ne: "admin"
    };
  }
  if (req.query.actived == 'true') {
    query.actived = true;
  }

  console.info('query', query)
  SN.paginate(query, {
    page: req.query.page + 1,
    limit: + req.query.limit
  }, null, {
    sort: {
      userName: -1
    }
  }).then(doc => {
    res.json(doc);
  }).catch(e => {
    return next(boom.badRequest(e));
  });
};

exports.snCreate = function (req, res, next) {
  var docs = [];
  for (var i = 0; i < + req.body.snCount; i++) {
    var sn = ph.radmon(16);
    sn = sn.slice(0, 4) + "-" + sn.slice(4, 8) + "-" + sn.slice(8, 12) + "-" + sn.slice(12);
    var doc = {
      userName: req.body.userName,
      mobile: req.body.mobile,
      idCard: req.body.idCard,
      address: req.body.address,
      gender: req.body.gender,
      sn,
      createDate: new Date(),
      actived: 0,
      isPaid: 1,
      price: 199,
      agentPrice: req.body.agentPrice
    };
    docs.push(doc);
  }

  SN
    .collection
    .insertMany(docs)
    .then(docs => {
      res.json(docs.ops);
    })
    .catch(e => {
      return next(boom.badRequest(e));
    });
};

exports.snActivate = function (req, res, next) {
  Promise.all([
    SN.findOne({sn: req.body.sn}),
    User.findOne({userName: req.user.sub})
  ]).then(async([sn, user]) => {
    if (!sn) {
      throw `充值码 '${req.body.sn}' 不存在`;
    }
    if (sn.actived == 1) {
      throw `${req.body.sn}已被使用,激活失败`;
    }
    sn.actived = 1;
    sn.activedUser = req.user.sub;
    sn.activedDate = new Date();
    await sn.save();
    return balanceService.upgrade(user,sn.price)
  }).then(doc => {
    res.json(doc);
  }).catch(e => {
    console.log(e);
    return next(boom.badRequest(e));
  });
};


function shortAuthor(user){
  return  '***' + (user.length > 4? user.substring(user.length - 4) :user) ;
}