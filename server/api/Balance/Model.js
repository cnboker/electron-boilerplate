'use strict'
var mongoose = require('mongoose')
var Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate');

var balanceSchema = new Schema({
  user: String, //账单用户
  createDate: Date, //账单日期
  serviceDate: Date, //服务开始时间
  amount: Number, //付费金额
  days: Number, //服务天数
  payType: Number, //1.recharge, 2.佣金
  remark: String, //备注
  status: Number, //0.未付款，1.已付款
  updateDate:Date //更新日期
});

balanceSchema.plugin(mongoosePaginate) //pagination function
module.exports = mongoose.model('Balance', balanceSchema)
