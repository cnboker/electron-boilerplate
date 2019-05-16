'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var AnswerSchema =new Schema({
  content:String, //内容
  question_id:Schema.Types.ObjectId,
  author:String, //
  create_at:Date, //创建日期
  update_at:Date,//更新日期
  upvote:Number
});

module.exports.Answer = mongoose.model('Answer', AnswerSchema);


var CommentSchema = new Schema({
  content:String,
  commentable_type:String,//answer or question
  commentable_id:Schema.Types.ObjectId, //answer'id or comment'id
  question_id:Schema.Types.ObjectId,
  author:String,
  create_at:Date,
  update_at:Date
})
module.exports.Comment = mongoose.model('Comment',CommentSchema)

var FollowSchema = new Schema({
   user:String,
   topic:String,
   create_at:Date,
   update_at:Date
})
module.exports.Follow = mongoose.model('Follow',FollowSchema)

var QuestionSchema = new Schema({
  title:String,
  description:String,
  author:String,
  create_at:Date,
  update_at:Date,
  topics:[{type:String}]
})

module.exports.Question = mongoose.model('Question',QuestionSchema)



