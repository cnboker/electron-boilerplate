'use strict';

var mongoose = require('mongoose');
var Scheam = mongoose.Schema;

var userSchema = new Scheam({
  userName: String, //username
  password: String, //password
  email: String,
  ip: String, //ip
  locked: Boolean, //is locked,
  createDate: Date,
  actived: Boolean,
  todayPoint: Number, //今日获取点数, 帮别人点击增加点数
  totalPoint: Number, //总点数，
  lostPoint: Number, //消耗点数，别人帮点击消耗点数
  grade: Number, //1:免费账号,2:vip账号，3:企业账户
  upgradeGradeDate: Date, //升级日期
  vipExpiredDate: Date, //vip用户到期日期
});

module.exports = mongoose.model('User', userSchema);