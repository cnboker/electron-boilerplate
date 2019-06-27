
var sortBy = require("../utils/sort_by");
var Keyword = require("../api/Keyword/Model");
var orderKeywords = [];
var constants = require("./constants");
require("../utils/groupBy");
var userSession = require("./userSession");

module.exports.reset = function(){
  orderKeywords = [];
}
//数据准备
module.exports.keywordPrepare = async function() {
  //var onlineUsers = userSession.onlineUsers();
  var offlineUsers = userSession.offlineUsers();
  var unloadDataUsers = userSession.unloadDataUsers();

  var keywords = [];

  for (var user of unloadDataUsers) {
    var data = await getKeywords([user]);
    keywords.push(...data);
    userSession.dataLoaded(user);
  }

  for (var val of keywords) {
    if (val.dynamicRank === -1 || val.resultIndexer < 10) {
      val.dayMaxPolishCount = 1;
    } else {
      val.dayMaxPolishCount = parseInt(
        ((val.resultIndexer || 0) / val.dynamicRank +
          (120 - val.dynamicRank) / 10) /
          2
      ); //当日最大点击量
    }
    val.polishStatus = 0; //0：正常点击, 1:超过当日点击量停止点击, 2:当日排名上升停止点击,3:排名点击2次后排名下降停止点击, 4:用户离线
    val.status = 1;
  }

  for (var val of orderKeywords) {
    if (offlineUsers.indexOf(val.user) > 0) {
      val.polishStatus = 4;
      val.status = 0;
    } else {
      if (val.polishStatus === 4) { //离线的改成在线的
        val.status = 1;
      }
    }
  }
  orderKeywords.push(...keywords);

  return shuffle(orderKeywords);
};

function shuffle(array) {
  var currentIndex = array.length,
    temporaryValue,
    randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

async function getKeywords(users) {
  return Keyword.find(
    {
      originRank: {
        $gt: 0
      },

      isValid: true,
      status: 1,
      shield: {
        //过滤过期会员无效的关键字
        $ne: 1
      },
      engine: "baidu",
      user: {
        $in: users
      }
    },
    "_id user originRank dynamicRank keyword link resultIndexer polishedCount",
    {
      //only selecting the "_id" and "keyword" , "engine" "link"fields,
      sort: {
        lastPolishedDate: -1
      },
      limit: constants.DAY_MAX_POLISH_COUNT
    }
  )
    .lean()
    .exec();
}

function sort(arr) {
  var newDocs = [];
  var gd = arr.groupBy("user");
  //console.log('-----------------',gd)
  var keys = Object.keys(gd);
  for (var key in gd) {
    gd[key] = gd[key].sort(sortBy("originRank", true));
  }

  while (Object.keys(gd).length > 0) {
    for (var key in gd) {
      var arr = gd[key];
      var val = arr.shift();
      if (val) {
        newDocs.push(val);
      }

      if (arr.length == 0) {
        delete gd[key];
      }
    }
  }
  return newDocs;
}
