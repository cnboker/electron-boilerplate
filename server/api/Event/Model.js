var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var eventSchema = new Schema({
    keyword_id:Schema.Types.ObjectId,
    text:String,
    createDate:Date
})

module.exports = mongoose.model('Event',eventSchema)