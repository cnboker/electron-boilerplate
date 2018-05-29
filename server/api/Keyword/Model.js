'use strict';

var mongoose = require('mongoose');
var Scheam = mongoose.Schema;

var keywordSckema =new Scheam({
  keyword:String, //关键字
  engine:String, //搜索引擎
  link:String, //搜索引擎包含关键字
  user:String, //操作用户
  manualPage:Number, //用户输入页数
  systemPage:Number, //系统扫描的实际页数
  dynamicPage:Number, //当前页数
  todayPolished:Boolean, //今天数据是否擦亮
  lastPolishedDate:Date, //上次擦亮时间
  isValid:Boolean, //如果前15页未找到则认为关键字设置无效,
  createDate:Date,
  polishedCount:Number //擦亮次数
});

module.exports = mongoose.model('Keyword', keywordSckema);