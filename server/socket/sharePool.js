const pool = [];
const finishedPool = [];
const VIP_REPEAT_TIMES = 3;
const POOL_MAX_LENGTH = 200;

module.exports.pool = pool;
module.exports.finishedPool = finishedPool;

//如果是vip用户，同一个关键字可以分发3次
module.exports.push = function(user,keyword){
  var existItem = pool.filter(item => {
    return item._id.toString() === keyword._id.toString();
  });

  if (existItem.length > 0) {
    return;
  }

  el.isVIP = user.grade === 2;
  singlePush(el)
}

function singlePush(el){
  el.repeat = 1;
  if(el.isVIP){
    //vip
    el.repeat = VIP_REPEAT_TIMES;
  }
  pool.push(el)
}

module.exports.shift = function(){
  if(pool.length == 0)return []
  var first = pool[0];
 
  var min = 2 * 60; //1min
  var max = 5 * 60; // 5min
  var next = moment().add(random(min, max), "seconds");
  first.runTime = next.format("YYYY-MM-DD HH:mm:ss");
  //重新压栈
  return [first];
}


//polish end
module.exports.end = function(doc){
  //将完成的任务移到已完成队列
  var polishedDocs = pool.filter(e => {
    return e._id.toString() === doc._id.toString();
  });

  polishedDocs.forEach(element => {
    element.tasker = user;
    element.polishedCount = doc.polishedCount;
    element.dynamicRank = doc.dynamicRank;
    finishedPool.push(element);
    //finishedPool.length = Math.min(finishedPool.length, POOL_MAX_LENGTH)
    //压缩到200长度
    if(finishedPool.length > POOL_MAX_LENGTH){
      finishedPool.splice(0, finishedPool.length - POOL_MAX_LENGTH)
    }
    element.repeat -= 1;
    if(element.repeat === 0){
      var index = pool.indexOf(element);
      pool.splice(index, 1);
      singlePush(element)
    }
  });

  console.log('sharePool count', sharePool.length, ',finishedPool count=', finishedPool.length)
}