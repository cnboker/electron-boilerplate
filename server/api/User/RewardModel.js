
var mongoose = require('mongoose')
var Schema = mongoose.Schema;

var rewardCodeSchema = new Schema({
  code:String,
  isUsed:Boolean
})

module.exports = mongoose.model('RewardCode', rewardCodeSchema);
