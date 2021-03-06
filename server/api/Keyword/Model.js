'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate');

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
  shield:Number, //被管理员屏蔽 0.正常, 1.vip过期屏蔽， 2.普通会员屏蔽
  adIndexer:Number, //首页广告数量
  resultIndexer:Number,//搜索结果/10000,竞争度指数
  mOriginRank:Number, //移动端：系统开始排名，-1表示已扫描未找到
  mDynamicRank:Number, //移动端：当前页数
  tags:String, //标签
  bearNo:String //熊掌号
});

keywordSchema.plugin(mongoosePaginate) //pagination function
module.exports = mongoose.model('Keyword', keywordSchema);