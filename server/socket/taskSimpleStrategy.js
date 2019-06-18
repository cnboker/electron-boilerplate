var moment = require("moment");
var time = require("../utils/time");
var sortBy = require("../utils/sort_by");
var User = require("../api/User/Model");
var Keyword = require("../api/Keyword/Model");
var orderKeywords = [];
var constants = require("./constants");
require("../utils/groupBy");
var userSession = require("./userSession");

//上次请求用户列表
var lastUsers = [];
//数据准备
module.exports.keywordPrepare = async function() {
  var users = userSession.onlineUsers();
  var diffUsers = getDiffUsers(users);

  lastUsers = users;
  var allUsers = userSession.todayUsers();
  var keywords = [];
  for (var user of diffUsers.newUsers) {
    var data = await getKeywords([user]);
    keywords.push(...data);
  }

  for (var val of keywords) {
    if(val.dynamicRank === -1 || val.resultIndexer < 10){
      val.dayMaxPolishCount = 1;
    }else{     
      val.dayMaxPolishCount = parseInt(
        ((val.resultIndexer || 0) / val.dynamicRank +
          (120 - val.dynamicRank) / 10) /
          2
      ); //当日最大点击量
    }
    val.polishStatus = 0; //0：正常点击, 1:超过当日点击量停止点击, 2:当日排名上升停止点击,3:排名点击2次后排名下降停止点击, 4:用户离线
    if (allUsers[val.user]) {
      var { status, joinTime, leaveTime } = allUsers[val.user];
      val.status = status;
      val.joinTime = joinTime;
      val.leaveTime = leaveTime || new Date();
    }
  }

  for (var val of orderKeywords) {
    if (diffUsers.offlineUsers.indexOf(val.user) > 0) {
      val.polishStatus = 4;
      val.status = 0;
    }
  }
  orderKeywords.push(...keywords);
  return sort(orderKeywords);
};

function getDiffUsers(users) {
  var newUsers = [],
    originUsers = [];
  for (var i = 0; i < users.length; i++) {
    var curUser = users[i];
    var index = lastUsers.indexOf(curUser);
    if (index > 0) {
      originUsers.push(curUser);
      lastUsers.splice(index, 1);
    } else {
      newUsers.push(curUser);
    }
  }
  return {
    newUsers, //对比上一次新增加的用户列表
    originUsers, //一直保持在线的用户列表
    offlineUsers: lastUsers //上次在线本次离线的用户列表
  };
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
        polishedCount: 1
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
