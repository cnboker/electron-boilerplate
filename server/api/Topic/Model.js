var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TopicSchema = new Schema({
  topic: String, 
  userName: String, //所属用户
  catelog: String, //keyword=1, quota=2
  create_at: Date,
  update_at: Date
})
module.exports = mongoose.model('Topic', TopicSchema)
