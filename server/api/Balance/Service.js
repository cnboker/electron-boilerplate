var moment = require('moment');
var Balance = require('./Model')
var Keyword = require('../Keyword/Model')

//升级
exports.upgrade = async function (user,price=199) {
  var serviceDays = 30;
  var start = moment();
  if (user.vipExpiredDate && moment().diff(moment(user.vipExpiredDate), "hours") < 0) {
    start = user.vipExpiredDate;
  }
  var balance = new Balance({
    user: user.userName,
    amount: price,
    createDate: new Date(),
    updateDate: new Date(),
    serviceDate: start,
    days: serviceDays,
    remark: `VIP充值金额${price}`,
    payType: 1,
    status: 1 //已付款
  });
  await balance.save();

  //注册包括推荐人且用户第一次开通vip推荐人获取佣金
  if (user.reference && user.grade === 1) {
    var referUser = await User.findOne({rewardCode: user.reference})
    balance = new Balance({
      user: referUser.userName, //推荐人
      amount: 50,
      createDate: new Date(),
      remark: `用户${user.userName}开通VIP奖励`,
      payType: 2, //bill
      status: 0 //未付款
    })
    await balance.save();
  }

  user.grade = 2;
  user.upgradeGradeDate = new Date();
  user.vipExpiredDate = moment(start).add(serviceDays, "days");
  await user.save();

  return Keyword.updateMany({
    user: user.userName,
    shield: 1
  }, {
    shield: 0
  }, {multi: true});
}