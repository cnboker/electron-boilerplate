const VIP_REPEAT_TIMES = 2;
const POOL_MAX_LENGTH = 200;

var moment = require("moment");
var random = require("../utils/random");
var pool = [];
const finishedPool = [];
const shiftPool = [];

module.exports.pool = shiftPool;
module.exports.finishedPool = finishedPool;

//如果是vip用户，同一个关键字可以分发3次
module.exports.push = function(user, keyword) {
  var existItem = pool.filter(item => {
    return item._id.toString() === keyword._id.toString();
  });

  if (existItem.length > 0) {
    return;
  }

  keyword.isVIP = user.grade == 2;
  singlePush(keyword);
};

function singlePush(el) {
  el.repeat = 1;
  if (el.isVIP) {
    //vip
    el.repeat = VIP_REPEAT_TIMES;
  }
  for (var i = 0; i < el.repeat; i++) {
    shiftPool.push(el);
  }
  pool.push(el);
}

function clone(element) {
  return JSON.parse(JSON.stringify(element));
}

module.exports.shift = function(user) {
  var first = shiftPool.find(element => {
    return element.user != user;
  });
  //var first = shiftPool.shift();
  var inDoTasksTime = (() => {
    var startTime = 9 * 60;
    var endTime = 18 * 60 + 30;
    var d = new Date();
    var nowTime = d.getHours() * 60 + d.getMinutes();
    return nowTime > startTime && nowTime < endTime;
  })();
  var min = 2 * 60; //1min
  var max = 5 * 60; // 5min
  if (!inDoTasksTime) {
    min = 10 * 60; //1min
    max = 30 * 60; // 5min
  }
  if (first) {
    var next = moment().add(random(min, max), "seconds");
    first.runTime = next.format("YYYY-MM-DD HH:mm:ss");
    shiftPool.splice(shiftPool.indexOf(first), 1);
    return [first];
  } else {
    pool = [];
  }
  return [];
};

//polish end
//user:username
module.exports.end = function(user, doc) {
  //将完成的任务移到已完成队列
  var polishedDocs = pool.filter(e => {
    return e._id.toString() === doc._id.toString();
  });

  polishedDocs.forEach(element => {
    element.tasker = user;
    element.polishedCount = doc.polishedCount;
    element.dynamicRank = doc.dynamicRank;

    //finishedPool.length = Math.min(finishedPool.length, POOL_MAX_LENGTH)
    //压缩到200长度
    if (finishedPool.length > POOL_MAX_LENGTH) {
      finishedPool.splice(0, finishedPool.length - POOL_MAX_LENGTH);
    }
    element.repeat -= 1;
    if (element.repeat === 0) {
      var index = pool.indexOf(element);
      pool.splice(index, 1);
      finishedPool.push(element);
      // singlePush(clone(element));
    }
  });

  console.log(
    "sharePool count",
    pool.length,
    ",finishedPool count=",
    finishedPool.length
  );
};