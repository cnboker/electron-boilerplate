const POOL_MAX_LENGTH = 200;

var time = require('../utils/time')
const finishedPool = [];
const shiftPool = [];

module.exports.pool = shiftPool;
module.exports.finishedPool = finishedPool;

module.exports.push = function(keyword) {
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

  first.runTime = time.getRuntime();
  if (first.dynamicRank == -1) {
    first.dynamicRank = first.originRank;
  }
  return [first];
};


//polish end
//user:username
module.exports.end = function(user, doc) {
  doc.tasker = user;
  doc.update = new Date();
  finishedPool.push(doc);
  if (finishedPool.length > POOL_MAX_LENGTH) {
    finishedPool.splice(0, finishedPool.length - POOL_MAX_LENGTH);
  }

};
