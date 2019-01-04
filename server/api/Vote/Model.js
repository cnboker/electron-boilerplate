'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var VoteSchema = new Schema({object_id: Schema.Types.ObjectId, like: Number, dislike: Number, love: Number})
module.exports = mongoose.model('Vote', VoteSchema)