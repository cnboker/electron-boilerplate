var boom = require("boom");
var moment = require("moment");
var ph = require("../../utils/passwordHash");
var SN = require("./Model");
var User = require("../User/Model");
var Balance = require("../Balance/Model");
var Keyword = require("../Keyword/Model");

exports.agent = function(req, res, next) {
  SN.findOne({ userName: req.params.id })
    .then(doc => {
      res.json(doc);
    })
    .catch(e => {
      return next(boom.badRequest(e));
    });
};

exports.list = function(req, res, next) {
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
  if(req.query.actived == 'true'){
    query.actived = true;
  }

  console.info('query',query)
  SN.paginate(
    query,
    {
      page: req.query.page + 1,
      limit: +req.query.limit
    },
    null,
    {
      sort: {
        userName: -1
      }
    }
  )
    .then(doc => {
      res.json(doc);
    })
    .catch(e => {
      return next(boom.badRequest(e));
    });
};

exports.snCreate = function(req, res, next) {
  var docs = [];
  for (var i = 0; i < +req.body.snCount; i++) {
    var sn = ph.radmon(16);
    sn =
      sn.slice(0, 4) +
      "-" +
      sn.slice(4, 8) +
      "-" +
      sn.slice(8, 12) +
      "-" +
      sn.slice(12);
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

  SN.collection
    .insertMany(docs)
    .then(docs => {
      res.json(docs.ops);
    })
    .catch(e => {
      return next(boom.badRequest(e));
    });
};

exports.snActivate = function(req, res, next) {
  Promise.all([
    SN.findOne({ sn: req.body.sn }),
    User.findOne({ userName: req.user.sub })
  ])
    .then(([sn, user]) => {
      if (!sn) {
        throw `sn '${req.body.sn}' 不存在`;
      }
      if (sn.actived == 1) {
        throw `${req.body.sn}已被使用,激活失败`;
      }
      sn.actived = 1;
      sn.activedUser = req.user.sub;
      sn.activedDate = new Date();
      sn.save();

      var serviceDays = 30;
      var start = moment();
      if (
        user.vipExpiredDate &&
        moment().diff(moment(user.vipExpiredDate), "hours") < 0
      ) {
        start = user.vipExpiredDate;
      }
      var balance = new Balance({
        user: req.user.sub,
        amount: sn.price,
        createDate: new Date(),
        serviceDate: start,
        days: serviceDays,
        remark: `vip充值金额${sn.price}`
      });
      balance.save();

      user.grade = 2;
      user.upgradeGradeDate = new Date();
      user.vipExpiredDate = moment(start).add(serviceDays, "days");
      user.save();

      return Keyword.updateMany(
        {
          user: req.user.sub,
          shield: 1
        },
        {
          shield: 0
        },
        {
          multi: true
        }
      );
    })
    .then(doc => {
      res.json(doc);
    })
    .catch(e => {
      console.log(e);
      return next(boom.badRequest(e));
    });
};
