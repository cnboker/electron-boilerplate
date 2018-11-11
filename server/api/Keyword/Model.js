'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var keywordSchema =new Schema({
  engine:String, //搜索引擎
  keyword:String, //关键词
  link:String, //搜索引擎包含关键词
  user:String, //操作用户
  originRank:Number, //系统开始排名，-1表示已扫描未找到
  dynamicRank:Number, //当前页数
  lastPolishedDate:Date, //上次擦亮时间
  isValid:Boolean, //如果前100名未找到则认为关键词设置无效,
  createDate:{type:Date,default:Date.now},
  todayPolishedCount:Number,//今天擦亮次数
  polishedCount:Number, //总擦亮次数,
  everyDayMaxPolishedCount:Number, //每天最大擦亮次数
  status:Number, //1. 运行, 2.暂停,
  Shield:Boolean //被管理员屏蔽
});

module.exports = mongoose.model('Keyword', keywordSchema);

