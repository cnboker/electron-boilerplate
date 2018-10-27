'use strict';

var mongoose = require('mongoose');
var Scheam = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate');

var userSchema = new Scheam({
  userName: String, //username
  password: String, //password
  email: String,
  ip: String, //ip
  locked: Boolean, //is locked,
  createDate: Date,
  actived: Boolean,
  //todayPoint: Number, //今日获取点数, 帮别人点击增加点数
  point: Number, //总点数，
  //lostPoint: Number, //消耗点数，别人帮点击消耗点数
  grade: Number, //1:免费账号,2:vip账号，3:企业账户
  upgradeGradeDate: Date, //升级日期
  vipExpiredDate: Date, //vip用户到期日期
  lastLoginDate:Date,
  engine:String, //优化引擎,
  status:Number, //1 online, 0 offline,
  rankSet:Number //1 排名检测同时优化, 2:检测排名不优化
});
userSchema.plugin(mongoosePaginate) //pagination function
module.exports = mongoose.model('User', userSchema);