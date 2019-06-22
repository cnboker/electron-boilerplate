var schedule = require("node-schedule");
var time = require("../utils/time");
var taskStrategy = require("./taskSimpleStrategy");
var User = require("../api/User/Model");
var userSession = require("./userSession");
var shiftPool = [];

var initilize = false;
module.exports = function() {
  if (!initilize) {
    schedule.scheduleJob("*/30 * * * *", () => {
      keywordsSessionBuild();
    });

    //run every day at 23:00
    schedule.scheduleJob("00 00 23 * * 0-6", function () {
      userSession.reset();
      shiftPool = [];
      taskStrategy.reset();
    });

    initilize = true;
    var timer = setTimeout(()=>{
      keywordsSessionBuild();
      clearTimeout(timer)
    }, 10000)
  }
  return {
    taskRequest: user => {
      if (shiftPool.length === 0) {
        return [];
      }
      var first = shiftPool.find(e => {
        return e.user != user && e.polishStatus === 0;
      });

      if (!first) return [];

      shiftPool.splice(shiftPool.indexOf(first), 1);
      shiftPool.push(first);
      first.runTime = time.getRuntime();
      if (first.dynamicRank == -1) {
        first.dynamicRank = first.originRank;
      }
      return [first];
    },
    taskEnd: (user, keyword) => {
    
      if (user != keyword.user) {
        Promise.all([
          User.findOneAndUpdate(
            {
              userName: user
            },
            {
              $inc: {
                point: 1
              }
            },
            {
              upsert: true,
              new: true
            }
          ),
          //keyword user decrease point
          User.findOneAndUpdate(
            {
              userName: keyword.user
            },
            {
              $inc: {
                point: -1,
                todayPolishedCount: 1
              }
            },
            {
              upsert: true,
              new: true
            }
          )
        ]).then(([a, b]) => {
          console.log("update user point");
        });
      }
      var existItem = shiftPool.find(item => {
        return item._id.toString() === keyword._id.toString();
      });
      if (!existItem) return;
      existItem.tasker = user;
      existItem.update = new Date();
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

      if(keyword.dynamicRank < 10){
        existItem.polishStatus = 5; //排名上首页停止
      }
    },
    stats: () => {
      var onlineUserCount = userSession.onlineUsers().length;
      var upCount = 0,
        downCount = 0,
        normalCount = 0,
        clickCount = 0;
      for (var i = 0; i < shiftPool.length; i++) {
        var item = shiftPool[i];
        if (item.polishStatus === 2) {
          upCount++;
        } else if (item.polishStatus === 3) {
          downCount++;
        } else if(item.polishStatus === 0){
          normalCount++;
        }
        clickCount += item.polishList?item.polishList.length:0;
      }
      return {
        onlineUserCount, //在线用户数
        upCount, //当日排名上升比例
        downCount, //当日排名下降比例
        normalCount, //不变比例
        clickCount, //当日点击合计
        keywords: shiftPool
      };
    }
  };
};

function keywordsSessionBuild() {
  taskStrategy.keywordPrepare().then(keywords => {
    shiftPool = keywords;
  });
}
