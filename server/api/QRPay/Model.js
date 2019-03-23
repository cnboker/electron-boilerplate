var mongoose = require('mongoose')
var mongoosePaginate = require('mongoose-paginate')
var Schema = mongoose.Schema;

var qrPaySchema = new Schema({
  payNo:String,//付款单号
  payUser: String, //付款人
  payDate: Date, //付款日期
  keeper: String, //收款人
  keeperQR:String, //收款码
  payCode: String, //付款备注码
  status: Number, //付款状态
  confirmDate: Date //收款人确认日期
})

qrPaySchema.plugin(mongoosePaginate)
module.exports = mongoose.model('QRPay',qrPaySchema)