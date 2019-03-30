var Balance = require("../Balance/Model");
var User = require("./Model");
var constants = require('./constants')
var moment = require('moment');

exports.profile = function (userName) {
  return new Promise((resolve, reject) => {
    Promise.all([
      User.findOne({userName}),
      Balance.find({
        user: userName
      }, null, {
        sort: {
          createDate: -1
        }
      })
    ]).then(([user, list]) => {
      var profile = {};
      profile._id = user._id;
      profile.userName = user.userName;
      profile.grade = constants.userGrade(user.grade);
      profile.gradeValue = user.grade;
      profile.expiredDate = user.vipExpiredDate;
      profile.vipUserExpired = moment().diff(user.vipExpiredDate, 'days') > 0;
      profile.rank = user.rank;
      profile.rewardCode = user.rewardCode;
      profile.wxpayUrl = user.wxpayUrl;
      profile.keeper = user.keeper;
      profile.nickname = user.nickname;
      profile.balance = list
      resolve(profile)
    }).catch(e => {
      reject(e)
    })
  })

}