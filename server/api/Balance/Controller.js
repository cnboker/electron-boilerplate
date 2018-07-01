'use strict'

var mongoose = require('mongoose')
var User = mongoose.model('User')
var Balance = mongoose.model('Balance')
var jwt = require('jsonwebtoken')
var config = require('../../config.js')
var moment = require('moment')
var boom = require('boom')

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
exports.all = function (req, res) {
  Balance.find({
      'user': req.user.sub
    }, null, {
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
    })
}

exports.pay = function (req, res, next) {
  var remanders = req.body.amount % config.vipServiceFeePerMonth;
  var months = parseInt(req.body.amount / config.vipServiceFeePerMonth);
  if (req.body.amount < config.vipServiceFeePerMonth) {
    return next(boom.badRequest('付费金额不能小于单价'))
  }
  if (remanders > 0) {
    return next(boom.badRequest('付费金额与单价不能整除'))
  }
  var serviceDays = months * 30;
  User.findOne({
      userName: req.body.userName
    })
    .then((doc) => {
      if (doc == null) {
        throw '用户不存在'
      }
      return doc;
    })
    .then((user) => {
      if (user.vipExpiredDate == undefined) {
        user.vipExpiredDate = Date.now();
      }
      
      var balance = new Balance({
        user: req.body.userName,
        amount: req.body.amount,
        createDate: Date.now(),
        serviceDate: user.vipExpiredDate,
        days: serviceDays,
        remark: `vip充值金额${req.body.amount}`
      });
      balance.save()
      return user;
    })
    .then((user) => {
      user.grade = 2;
      user.upgradeGradeDate = Date.now();
      if (user.vipExpiredDate == undefined) {
        user.vipExpiredDate = Date.now();
      }
      user.vipExpiredDate = moment(user.vipExpiredDate).add(serviceDays, 'days')
      return user.save()
    })
    .then(function (updateUser) {
      res.json(updateUser)
    })
    .catch(function (e) {
      return next(boom.badRequest(e));
    })

}