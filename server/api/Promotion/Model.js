var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var proSchema = new Schema({
    rewardCode:String,
    ip:String,
    createDate:Date
})

module.exports = mongoose.model('Promotion',proSchema)