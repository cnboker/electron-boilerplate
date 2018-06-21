'use strict'
var mongoose = require('mongoose')
var Schema = mongoose.Schema;

var balanceSchema = new Schema({
  user:String, //账单用户
  createDate:Date, //账单日期
  amount:Number, //付费金额
  days:Number,//服务天数
  remark:String //备注
});

module.exports = mongoose.model('Balance', balanceSchema)