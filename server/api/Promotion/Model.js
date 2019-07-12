var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var proSchema = new Schema({
    userId:String,
    rewardCode:String,
    ip:String,
    createDate:Date,
    updateDate:Date,
    action:Number //1:share, 2:download, 3:register, 4:vip
})

module.exports = mongoose.model('Promotion',proSchema)