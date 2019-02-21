var Keyword = require("../api/Keyword/Model");
var User = require("../api/User/Model");
var moment = require("moment");
var sharePool = require("./sharePool");
/*{
    userName:{
        mykeywords:{},
        myInfo:{}
    }
}
*/

//用户自己的数据管理队列
var userPool = {};

//用户加入
function userJoin(user) {
  if (userPool[user]) {
    var myuser = userPool[user];
    myuser.myInfo.status = 1;
    var keywords = myuser.mykeywords;
    if (keywords && keywords.length > 0) {
      return;
    }
  }

  Promise.all([
    User.findOne({ userName: user }),
    Keyword.find(
      {
        user,
        originRank: {
          $gt: 0
        },
        isValid: true,
        status: 1,
        shield: {
          //过滤过期会员无效的关键字
          $ne: 1
        }
      },
      "_id user originRank dynamicRank keyword link polishedCount title",
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

    var userInfo = userDoc.toObject();
    //黑名单用户不优化
    if (userInfo.locked) {
      keywords = [];
    }

    userPool[user] = {
      myInfo: userInfo,
      mykeywords: keywords
    };

    var first = keywords.shift();
    if (first) {
      sharePool.push(first);
    }
  });
}

//任务完成 user:current user
// keyword: polish keyword object
function polishFinished(user, doc) {
  if (user != doc.user) {
    //current add point
    User.findOneAndUpdate(
      {
        userName: user
      },
      {
        $inc: {
          point: 1,
          todayPolishedCount: 1
        }
      },
      { upsert: true, new: true }
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
      },
      { upsert: true,new: true }
    );
  }

  sharePool.end(user, doc);

  var my = userPool[user];
  if (!my) return;
  //需要优化的会员数据才会加入共享池进行优化
  var rankSet = my.myInfo.rankSet || 1;
  if (rankSet == 1) {
    var first = my.mykeywords.shift();
    if (first) {
      sharePool.push(first);
    }
  }
}

//用户离开
function userLeave(user) {
  if (!userPool[user]) return;
  User.findOne({ userName: user })
    .then(doc => {
      var myuser = userPool[user].myInfo;
      myuser.status = 0;
      setTimeout(() => {
        if (!userPool[user]) return;
        if (!myuser) return;
        if (myuser.status === 0) {
          console.log(user + ",用户60秒未登录,删除数据");
          doc.status = 0;
          doc.save();
          delete userPool[user];
        }
      }, 60000);
    })
    .catch(err => {
      console.log(err);
    });
}

//用户请求资源
function req(user) {
  var my = userPool[user];
  if (my === undefined) return "disconnect";
  if (my.myInfo === undefined) return "disconnect";
  //if (my.myInfo.locked) return []; //拉黑的用户不分配任务
  var result = sharePool.shift(user);
  //只检查的用户，一次获取1条共享池数据同时获取一条自己的数据检查排名
  var rankSet = my.myInfo.rankSet || 1;
  if (rankSet == 2) {
    var first = my.mykeywords.shift();
    if (first == undefined) return result;
    var next = moment().add(10, "seconds");
    first.runTime = next.format("YYYY-MM-DD HH:mm:ss");
    result.push(first);
  }
  return result;
}

function isOnline(user) {
  return userPool[user] != undefined;
}

//平衡用户资源分配 新注册用户优先， VIP会员优先，在线优先， 优币>0优先

module.exports = {
  userJoin,
  polishFinished,
  userLeave,
  reqTask: req,
  sharePool: sharePool.pool,
  finishedPool: sharePool.finishedPool,
  userPool,
  isOnline: isOnline
};
