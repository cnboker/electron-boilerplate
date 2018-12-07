const POOL_MAX_LENGTH = 200;

var moment = require("moment");
var random = require("../utils/random");
const finishedPool = [];
const shiftPool = [];

module.exports.pool = shiftPool;
module.exports.finishedPool = finishedPool;

module.exports.push = function(user, keyword) {
  var existItem = shiftPool.filter(item => {
    return item._id.toString() === keyword._id.toString();
  });

  if (existItem.length > 0) {
    return;
  }

  shiftPool.push(keyword);
};

function clone(element) {
  return JSON.parse(JSON.stringify(element));
}

module.exports.shift = function(user) {
  console.log("shiftPool.length----------", shiftPool.length);
  if (shiftPool.length == 0) {
    var strategy = require("../api/Keyword/taskSimpleStrategy");
    strategy.sortKeywords().then(docs => {
      shiftPool.push(...docs);
    });
    return [];
  }

  var first = shiftPool.find(element => {
    return element.user != user;
  });

  if (!first) return [];

  shiftPool.splice(shiftPool.indexOf(first), 1);

  first.runTime = getRunTime();
  if (first.dynamicRank == -1) {
    first.dynamicRank = first.originRank;
  }
  return [first];
};

function getRunTime() {
  var inDoTasksTime = (() => {
    var startTime = 8 * 60;
    var endTime = 20 * 60 + 30;
    var d = new Date();
    var nowTime = d.getHours() * 60 + d.getMinutes();
    return nowTime > startTime && nowTime < endTime;
  })();
  var min = 5 * 60; //2min
  var max = 40 * 60; // 10min
  if (!inDoTasksTime) {
    min = 0 * 60; //1min
    max = 30 * 60; // 60min
  }

  var next = moment().add(random(min, max), "seconds");
  return next.format("YYYY-MM-DD HH:mm:ss");
}

//polish end
//user:username
module.exports.end = function(user, doc) {
  doc.tasker = user;
  finishedPool.push(doc);
  if (finishedPool.length > POOL_MAX_LENGTH) {
    finishedPool.splice(0, finishedPool.length - POOL_MAX_LENGTH);
  }
};
