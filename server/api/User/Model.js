'use strict';

var mongoose = require('mongoose');
var Scheam = mongoose.Schema;

var userSckema =new Scheam({
  userName:String, //username
  password:String, //password
  email:String,
  ip:String, //ip
  locked:Boolean, //is locked,
  createDate:Date,
  actived:Boolean,
  todayPoint:Number, //今日获取点数, 帮别人点击增加点数
  totalPoint:Number, //总点数，
  lostPoint:Number //消耗点数，别人帮点击消耗点数
});

module.exports = mongoose.model('User', userSckema);