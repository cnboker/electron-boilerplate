var mongoose = require('mongoose')
var Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate')
var snSchema = new Schema({
   userName:String,
   mobile:String,
   idCard:String,//身份证
   address:String, //地址
   remark:String, //备注
   gender:String, //性别
   province:String, //省份
   sn:String,//激活码
   createDate:Date,
   actived:Boolean,//是否已经激活; 0:未激活,1:已激活
   activedDate:Date,//激活日期
   activedUser:String,//激活用户
   isPaid:Boolean, //是否已经付款
   price:Number, //市场价格
   agentPrice:Number, //代理商价格
})

snSchema.plugin(mongoosePaginate)
module.exports = mongoose.model('SN',snSchema)
