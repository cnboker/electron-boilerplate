var boom = require("boom");
var moment = require("moment");

var Keyword = require("../api/Keyword/Model");
var User = require("../api/User/Model");
var constants = require("./constants");
var random = require("../utils/random");
/*{
    userName:{
        mykeywords:{},
        myInfo:{}
    }
}
*/

//用户自己的数据管理队列
var userPool = {};
//用户投放的共享队列数据
var sharePool = [];
//当天已经完成的队列
var finishedPool = [];

//用户加入
function userJoin(user) {
  if (userPool[user] === null) return;
  if (userPool[user] === undefined) {
    userPool[user] = null;
  }
  Promise.all([
    User.findOne({ userName: user }),
    Keyword.find(
      {
        user,
        originRank: { $gt: 0 },
        isValid: true,
        status: 1
      },
      "_id user originRank dynamicRank keyword link polishedCount",
      {
        sort: {
          polishedCount: 1
        }
      }
    )
      .lean()
      .exec()
  ]).then(([userDoc, keywords]) => {
    userDoc.lastLoginDate = new Date();
    userDoc.status = 1; //在线
    userDoc.save();

    userPool[user] = {
      myInfo: userDoc.toObject(),
      mykeywords: keywords
    };

    console.log("user pools keywords=", keywords);

    var first = keywords.shift();
    if (first) {
      var existItem = sharePool.filter(item => {
        return item._id.toString() === first._id.toString();
      });

      if (existItem.length > 0) {
        return;
      }
      existItem = finishedPool.filter(item => {
        return item._id === first._id;
      });
      if (existItem.length > 0) {
        return;
      }
      sharePool.push(first);
      //循环处理
      //keywords.push(first)
    }
  });
}

//任务完成
//user:current user
//keyword: polish keyword object
function polishFinished(user, doc) {
  if (user !== doc.user) {
    //current add point
    User.findOneAndUpdate(
      {
        userName: user
      },
      {
        $inc: {
          point: 1
        }
      }
    );

    //keyword user decrease point
    User.findOneAndUpdate(
      {
        userName: doc.user
      },
      {
        $inc: {
          point: -1
        }
      }
    );
    
  }
  

  //将完成的任务移到已完成队列
  var polishedDocs = sharePool.filter(e => {
    return e._id.toString() === doc._id.toString();
  });

  polishedDocs.forEach(element => {
    finishedPool.push(element);
    var index = sharePool.indexOf(element);
    sharePool.splice(index, 1);
  });

  var my = userPool[user];
  if (!my) return;
  var first = my.mykeywords.shift();
  if (first) {
    sharePool.push(first);
  }
  console.log('sharePool count', sharePool.length, ',finishedPool count=', finishedPool.length)
}

//用户离开
function userLeave(user) {
  User.findOne({ userName: user })
    .then(doc => {
      doc.status = 0;
      doc.save();
    })
    .catch(err => {
      console.log(err);
    });
  delete userPool[user];
}

//用户请求资源
function req(user) {
  var tmp = [];
  console.log("userPool[user]=", userPool[user]);
  if (userPool[user] === undefined) return tmp;
  //var point = userPool[user].myInfo.point || 0;
  var keyword = sharePool.shift();
    if (keyword) {
      setRunTime(keyword);
      tmp.push(keyword);
      sharePool.push(keyword)
    }
  return tmp;
}

function setRunTime(doc) {
  var min = 1 * 10; //1min
  var max = 1 * 60; // 5min
  var next = moment().add(random(min, max), "seconds");
  doc.runTime = next.format("YYYY-MM-DD HH:mm:ss");
}

//平衡用户资源分配
//新注册用户优先， VIP会员优先，在线优先， 优币>0优先

module.exports = {
  userJoin,
  polishFinished,
  userLeave,
  reqTask: req,
  sharePool,
  finishedPool
};
