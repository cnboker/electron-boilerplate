'use strict';

var mongoose = require('mongoose');
var Scheam = mongoose.Schema;

var keywordSckema =new Scheam({
  keyword:String, //关键字
  engine:String, //搜索引擎
  link:String, //搜索引擎包含关键字
  user:String, //操作用户
  //manualRank:Number, //用户输入页数
  originRank:Number, //系统开始排名，-1表示已扫描未找到
  dynamicRank:Number, //当前页数
  todayPolished:Number, //今天数据是否擦亮， 0 未擦亮， 1. 在擦亮， 2.已擦亮
  lastPolishedDate:Date, //上次擦亮时间
  isValid:Boolean, //如果前100名未找到则认为关键字设置无效,
  createDate:Date,
  polishedCount:Number //擦亮次数
});

module.exports = mongoose.model('Keyword', keywordSckema);