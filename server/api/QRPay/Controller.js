"use strict";

var boom = require("boom");
var moment = require("moment");

var User = require("../User/Model");
var QRPay = require("../QRPay/Model");
var ph = require("../../utils/passwordHash");
var strTool = require("../../utils/string");
var balanceService = require("../Balance/Service");

const PayStatus = {
  pending: 0,
  submit: 1,
  confirm: 2,
  cancel: 3
};

exports.list = (req, res, next) => {
  let query = {};
  if (req.query.user) {
    query.payUser = {
      $regex: ".*" + req.query.user + ".*",
      $ne: "admin"
    };
  }
  if(req.query.status == 1){
    query.status = 2;
  }
  if(req.query.startDate && req.query.endDate){
    query.createDate = {
      $gte: req.query.startDate,
      $lte: req.query.endDate
    };
  }

  
  QRPay.find(query)
    .then(docs => {
      res.json(docs);
    })
    .catch(e => {
      return next(boom.badRequest(e));
    });
};

//收款人信息

let currentKeeper = function() {
  let keeperQR = [];
  function getKeepers() {
    return new Promise((resolve, reject) => {
      if (keeperQR.length > 0) {
        resolve(keeperQR);
        return;
      }
      User.find({ keeper: true })
        .then(docs => {
          return docs.map(x => {
            return { keeper: x.userName, keeperQR: x.wxpayUrl };
          });
        })
        .then(docs => {
          keeperQR = docs;
          resolve(keeperQR);
        });
    });
  }

  return (async function first() {
    var keepers = await getKeepers();
    var first = keepers.shift();
    keepers.push(first);
    return first;
  })();
};

exports.pending = async (req, res, next) => {
  var keeper = await currentKeeper();
  console.log("keeper", keeper);
  QRPay.findOne({ payUser: req.user.sub, status: 0 })
    .then(doc => {
      if (!doc) {
        doc = Object.assign(
          {},
          {
            payNo: strTool.getOrderNo(),
            payUser: req.user.sub,
            createDate: new Date(),
            payCode: ph.radmon(3),
            status: PayStatus.pending
          },
          keeper
        );
        //create
        doc = QRPay(doc);
        return doc.save();
      } else {
        return doc;
      }
    })
    .then(doc => {
      console.log("pending", doc);
      res.json(doc);
    })
    .catch(e => {
      console.log("pending", e);
      return next(boom.badRequest(e));
    });
};

exports.postwxPay = (req, res, next) => {
  console.log("sub", req.user);
  QRPay.findOneAndUpdate(
    {
      payUser: req.user.sub,
      status: 0
    },
    {
      payDate: new Date(),
      status: PayStatus.submit
    },
    {
      upsert: true,
      new: true
    }
  )
    .then(doc => {
      console.log("postwxpay", doc);
      res.json(doc);
    })
    .catch(e => {
      return next(boom.badRequest(e));
    });
};

exports.confirm = async (req, res, next) => {
  QRPay.findOne({ payNo: req.body.payno })
    .then(doc => {
      // if (req.user.sub !== doc.keeper) {
      //   throw '必须收款本人账号确认付款'
      // }
      doc.status = PayStatus.confirm;
      doc.confirmDate = new Date();
      return doc.save();
    })
    .then(async doc => {
      var user = await User.findOne({ userName: doc.payUser });
      await balanceService.upgrade(user);
      res.json(doc);
    })
    .catch(e => {
      return next(boom.badRequest(e));
    });
};

exports.cancel = (req, res, next) => {
  QRPay.findOne({ payNo: req.body.payno })
    .then(doc => {
      // if (req.user.sub !== doc.keeper) {
      //   throw '必须收款本人账号取消付款'
      // }
      doc.status = PayStatus.cancel;
      doc.confirmDate = new Date();
      return doc.save();
    })
    .then(doc => {
      res.json(doc);
    })
    .catch(e => {
      return next(boom.badRequest(e));
    });
};
