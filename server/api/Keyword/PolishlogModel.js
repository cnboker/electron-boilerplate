
'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var polishLogSchema = new Schema({
    keyword_id:Schema.Types.ObjectId,
    keyword:String,
    user:String, //擦亮账号
    ip:String,
    createDate:Date
 })
 
 module.exports = mongoose.model('PolishLog', polishLogSchema);