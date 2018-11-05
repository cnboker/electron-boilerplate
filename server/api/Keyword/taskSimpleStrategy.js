var moment = require("moment");
var random = require("../../utils/random");
require("../../utils/groupBy");
var sortBy = require("../../utils/sort_by");
var User = require("../User/Model");
var Keyword = require("./Model");

module.exports.sortKeywords = function() {
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
            isValid: true,
            status: 1,
            engine: "baidu",
            user: {
              $in: names
            }
          },
          "_id user originRank dynamicRank keyword link", //only selecting the "_id" and "keyword" , "engine" "link"fields,
          {
            sort: {
              polishedCount: 1
            }
          }
        )
          .lean()
          .exec();
      })
      .then(docs => {
        var keywords = sort(docs);
        resolve(keywords);
      })
      .catch(e => {
        reject(e);
        console.log(e);
      });
  });
};

module.exports.strategy = function(docs) {
  var min = 3 * 60; //5min
  var max = 8 * 60; // 20min
  var next = moment().add(random(min, max), "seconds"); //hours,minutes,seconds
  var objs = [];
  var sortDocs = sort(docs);
  for (let doc of sortDocs) {
    //var obj = {...doc, time:next.format('YYYY-MM-DD HH:mm:ss')};
    const obj = Object.assign({}, doc, {
      runTime: next.format("YYYY-MM-DD HH:mm:ss")
    });
    objs.push(obj);
    //doc.runTime = next.format('YYYY-MM-DD HH:mm:ss');
    next = next.add(random(min, max), "seconds");
    //console.log(obj)
  }
  return objs;
};

function sort(docs) {
  var newDocs = [];
  console.info("doc type", docs);
  var arr = docs.filter(function(doc) {
    return doc.originRank != -1;
  });
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
      val = arr.shift();
      if (val) {
        newDocs.push(val);
      }
      val = arr.shift();
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
