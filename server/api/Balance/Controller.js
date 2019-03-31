var moment = require("moment");
var boom = require("boom");

var User = require("../User/Model");
var Balance = require("./Model");
var config = require("../../config.js");

exports.bill = function(req, res, next) {
  var query = {
    //payType: 2
  };

  if (req.query.startDate && req.query.endData) {
    query.createDate = {
      $gt: req.query.startDate,
      $lt: req.query.endDate
    };
  }
  if (req.query.name) {
    query.userName = {
      $regex: ".*" + req.query.name + ".*",
      $ne: "admin"
    };
  }
  console.log("status=", req.query.status);
  if (req.query.status == "true") {
    console.log("status=", req.query.status);
    query.status = 0;
  }

  console.info("query", query);
  Balance.paginate(
    query,
    {
      page: +req.query.page + 1,
      limit: +req.query.limit,
      sort:{createDate:-1}
    }
   
  )
    .then(result => {
      console.log("result", result);
      var docs = result.docs.reduce((map, doc) => {
        map[doc._id] = doc;
        return map;
      }, {});

      result.docs = docs;

      res.json(result);
    })
    .catch(e => {
      console.log(e);
      return next(boom.badRequest(e));
    });
};

exports.billPay = function(req, res, next) {
  Promise.all([Balance.findOne({ _id: req.body.id })])
    .then(([balance]) => {
      if (req.user.sub != "admin") throw "权限异常";
      balance.status = 1;
      balance.updateDate = new Date();
      return balance.save();
    })
    .then(doc => {
      res.json(doc);
    })
    .catch(e => {
      return next(boom.badRequest(e));
    });
};

/* example
// Find First 10 News Items
News.find({
    deal_id:deal._id // Search Filters
},
['type','date_added'], // Columns to Return
{
    skip:0, // Starting Row
    limit:10, // Ending Row
    sort:{
        date_added: -1 //Sort by Date Added DESC
    }
},
function(err,allNews){
    socket.emit('news-load', allNews); // Do something with the array of 10 objects
})
*/
exports.all = function(req, res) {
  Balance.find(
    {
      user: req.user.sub
    },
    null,
    {
      sort: {
        createDate: -1
      }
    },
    (err, docs) => {
      if (err) {
        res.send(err);
        return;
      }
      res.json(docs);
    }
  );
};

exports.pay = function(req, res, next) {
  var remanders = req.body.amount % config.vipServiceFeePerMonth;
  var months = parseInt(req.body.amount / config.vipServiceFeePerMonth);
  if (req.body.amount < config.vipServiceFeePerMonth) {
    return next(boom.badRequest("付费金额不能小于单价"));
  }
  if (remanders > 0) {
    return next(boom.badRequest("付费金额与单价不能整除"));
  }
  var serviceDays = months * 30;
  User.findOne({ userName: req.body.userName })
    .then(doc => {
      if (doc == null) {
        throw "用户不存在";
      }
      return doc;
    })
    .then(user => {
      var balance = new Balance({
        user: req.body.userName,
        amount: req.body.amount,
        createDate: new Date(),
        serviceDate: user.vipExpiredDate || new Date(),
        days: serviceDays,
        remark: `vip充值金额${req.body.amount}`
      });
      balance.save();

      user.grade = 2;
      user.upgradeGradeDate = new Date();
      user.vipExpiredDate = moment(user.vipExpiredDate || new Date()).add(
        serviceDays,
        "days"
      );
      return user.save();
    })
    .then(function(doc) {
      res.json(doc);
    })
    .catch(function(e) {
      return next(boom.badRequest(e));
    });
};
