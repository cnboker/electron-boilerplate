var time = require("../utils/time");
var taskStrategy = require("./taskSimpleStrategy");
const shiftPool = [];

module.exports.pushMany = function(keywords) {
  for (var k in keywords) {
    k.dayMaxPolishCount = parseInt(
      ((k.resultIndexer || 0) / k.dynamicRank + (100 - k.dynamicRank) / 10) / 2
    ); //当日最大点击量
    k.polishStatus = 0; //0：正常点击, 1:超过当日点击量停止点击, 2:当日排名上升停止点击,3:排名点击2次后排名下降停止点击
    shiftPool.push(k);
  }
  shiftPool = taskStrategy.sort(shiftPool);
};

//当日任务处理统计信息
module.exports.stats = function() {
  return {
    onlineUserCount: 0, //在线用户数
    upCount: 0, //当日排名上升比例
    downCount: 0, //当日排名下降比例
    normalCount: 0, //不变比例
    clickCount: 0, //当日点击合计
    keywords: []
  };
};
// module.exports.push = function(keyword) {
//   var existItem = shiftPool.filter(item => {
//     return item._id.toString() === keyword._id.toString();
//   });

//   if (existItem.length > 0) {
//     return;
//   }

//   shiftPool.push(keyword);
// };

// function clone(element) {
//   return JSON.parse(JSON.stringify(element));
// }

//取数
module.exports.take = function(user) {
  console.log("shiftPool.length----------", shiftPool.length);
  if (shiftPool.length == 0) {
    taskStrategy.keywordPrepare().then(docs => {
      var data = taskStrategy.sort(docs);
      shiftPool.push(...data);
    });
    return [];
  }

  var first = shiftPool.find(e => {
    return e.user != user && e.polishStatus === 0
  });

  if (!first) return [];

  shiftPool.splice(shiftPool.indexOf(first), 1);
  shiftPool.push(first);
  first.runTime = time.getRuntime();
  if (first.dynamicRank == -1) {
    first.dynamicRank = first.originRank;
  }
  return [first];
};

//polish end
//user:username
module.exports.takeback = function(user, keyword) {
  doc.tasker = user;
  doc.update = new Date();
  var existItem = shiftPool.filter(item => {
    return item._id.toString() === keyword._id.toString();
  });
  if (!existItem) return;

  if (!existItem.polishList) {
    existItem.polishList = [];
  }
  var polishList = existItem.polishList;
  polishList.push(keyword.dynamicRank);

  if (polishList.length >= existItem.dayMaxPolishCount) {
    existItem.polishStatus = 1; //超过当日点击量停止点击
    return;
  }
  if (existItem.dynamicRank > keyword.dynamicRank) {
    existItem.polishStatus = 2; //当日排名上升停止点击
    return;
  }

  if (existItem.dynamicRank < keyword.dynamicRank) {
    //排名下降
    existItem.polishStatus = 3; //排名下降停止点击
    return;
  }
  // if (finishedPool.length > POOL_MAX_LENGTH) {
  //   finishedPool.splice(0, finishedPool.length - POOL_MAX_LENGTH);
  // }
};
