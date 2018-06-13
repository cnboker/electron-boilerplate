'use strict';

var mongoose = require('mongoose');
var Scheam = mongoose.Schema;

var keywordSckema =new Scheam({
  keyword:String, //关键字
  engine:String, //搜索引擎
  link:String, //搜索引擎包含关键字
  user:String, //操作用户
  originRank:Number, //系统开始排名，-1表示已扫描未找到
  dynamicRank:Number, //当前页数
  lastPolishedDate:Date, //上次擦亮时间
  isValid:Boolean, //如果前100名未找到则认为关键字设置无效,
  createDate:Date,
  todayPolishedCount:Number,//今天擦亮次数
  polishedCount:Number, //总擦亮次数,
  everyDayMaxPolishedCount:Number, //每天最大擦亮次数
  status:Number //1. 运行, 2.暂停
});

module.exports = mongoose.model('Keyword', keywordSckema);

var polishLog = new Scheam({
   keyword_id:ObjectId,
   user:String, //擦亮账号
   ip:String,
   createDate:Date
})

module.exports = mongoose.model('PolishLog', polishLog);