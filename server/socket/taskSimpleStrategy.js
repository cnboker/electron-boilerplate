var moment = require("moment");
var time = require("../../utils/time");
require("../../utils/groupBy");
var sortBy = require("../../utils/sort_by");
var User = require("../User/Model");
var Keyword = require("./Model");
var orderKeywords = [];
var constants = require("./constants");

//数据准备
module.exports.keywordPrepare = function() {
  return new Promise((resolve, reject) => {
    Promise.all([
      User.find({
        locked: false,
        status: 1
      })
    ])
      .then(([onlineUsers]) => {
        var names = onlineUsers.map(x => {
          return x.userName;
        });
        return Keyword.find(
          {
            originRank: {
              $gt: 0
            },
            dynamicRank: {
              $gt: 0
            },
            isValid: true,
            status: 1,
            engine: "baidu",
            user: {
              $in: names
            }
          },
          "_id user originRank dynamicRank keyword link,resultIndexer,status", //only selecting the "_id" and "keyword" , "engine" "link"fields,
          {
            sort: {
              polishedCount: 1
            },
            limit: constants.DAY_MAX_POLISH_COUNT
          }
        )
          .lean()
          .exec();
      })
      .then(docs => {
        resolve(docs);
      })
      .catch(e => {
        reject(e);
        console.log(e);
      });
  });
};

module.exports.sort = function sort(arr) {
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
        val.dayMaxPolishCount = parseInt((((val.resultIndexer || 0) / val.dynamicRank) + (100-val.dynamicRank)/10) / 2) //当日最大点击量
        val.polishStatus = 0; //0：正常点击, 1:超过当日点击量停止点击, 2:当日排名上升停止点击,3:排名点击2次后排名下降停止点击
        newDocs.push(val);
      }

      if (arr.length == 0) {
        delete gd[key];
      }
    }
  }
  return newDocs;
}
