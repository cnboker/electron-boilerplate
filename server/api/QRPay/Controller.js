"use strict";

var boom = require("boom");
var moment = require("moment");

var User = require('../User/Model')
var QRPay = require('../QRPay/Model')
var ph = require('../../utils/passwordHash')
var strTool = require('../../utils/string')

const PayStatus = {
  pending: 0,
  submit: 1,
  confirm: 2,
  cancel: 3
}

exports.list = (req, res, next) => {

  let query = {}
  if (req.query.status && req.query.status >= 0) {
    query.status = req.query.status;
  }
  if (req.query.keeper) {
    query.keeper = req.query.keeper;
  }
  QRPay
    .paginate(query, {
    page :+ req.query.page + 1,
    limit :+ req.query.limit,
    sort: {
      createDate: -1
    }
  })
    .then(docs => {
      res.json(docs)
    })
    .catch(e => {
      return next(boom.badRequest(e))
    })
}

//收款人信息

let currentKeeper = function () {
  let keeperQR = [];
  function getKeepers() {
    return new Promise((resolve, reject) => {
      if (keeperQR.length > 0) {
        resolve(keeperQR)
        return;
      }
      User
        .find({keeper: true})
        .then(docs => {
          return docs.map(x => {
            return {keeper: x.userName, keeperQR: x.wxpayUrl}
          })
        })
        .then(docs => {
          keeperQR = docs;
          resolve(keeperQR)
        })
    })
  }

  return (async function first() {
    var keepers = await getKeepers();
    var first = keepers.shift();
    keepers.push(first)
    return first;
  })();
}

exports.pending = async(req, res, next) => {
  var keeper = await currentKeeper();
  console.log('keeper', keeper)
  QRPay
    .findOne({payUser: req.user.sub, status: 0})
    .then(doc => {
      if (!doc) {
        //create
        var doc = QRPay({
          payNo: strTool.getOrderNo(),
          payUser: req.user.sub,
          createDate: new Date(),
          payCode: ph.radmon(3),
          status: PayStatus.pending,
          ...keeper
        })
        return doc.save();
      } else {
        return doc;
      }
    })
    .then(doc => {
      console.log('pending', doc)
      res.json(doc)
    })
    .catch(e => {
      console.log('pending', e)
      return next(boom.badRequest(e))
    })
}

exports.postwxPay = (req, res, next) => {
  console.log('sub',req.user)
  QRPay.findOneAndUpdate({
    payUser: req.user.sub,
    status: 0
  }, {
    payDate: new Date(),
    status: PayStatus.submit
  }, {
    upsert: true,
    new: true
  }).then(doc => {
    console.log('postwxpay', doc)
    res.json(doc)
  }).catch(e => {
    return next(boom.badRequest(e))
  })
}

exports.confirm = (req, res, next) => {
  QRPay
    .findOne({payNo: req.body.payno})
    .then(doc => {
      if (req.user.sub !== doc.keeper) {
        throw '必须收款本人账号确认付款'
      }
      doc.status = PayStatus.confirm;
      doc.confirmDate = new Date();
      return doc.save();
    })
    .then(doc => {
      res.json(doc)
    })
    .catch(e => {
      return next(boom.badRequest(e))
    })
}

exports.cancel = (req, res, next) => {
  QRPay
    .findOne({payNo: req.body.payno})
    .then(doc => {
      if (req.user.sub !== doc.keeper) {
        throw '必须收款本人账号取消付款'
      }
      doc.status = PayStatus.cancel;
      return doc.save();
    })
    .then(doc => {
      res.json(doc)
    })
    .catch(e => {
      return next(boom.badRequest(e))
    })
}