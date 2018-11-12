var boom = require("boom");

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
    if (!myuser.load) return;
    var keywords = myuser.mykeywords;
    if (keywords && keywords.length > 0) {
      return;
    }
  }

  userPool[user] = {
    load: false
  };

  Promise.all([
    User.findOne({ userName: user }),
    Keyword.find(
      {
        user,
        originRank: {
          $gt: 0
        },
        isValid: true,
        status: 1
      },
      "_id user originRank dynamicRank keyword link polishedCount",
      {
        sort: {
          lastPolishedDate: 1,
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
    userPool[user] = {
      myInfo: userInfo,
      mykeywords: keywords,
      load: true
    };

    //console.log("user pools keywords=", keywords);

    var first = keywords.shift();
    if (first) {
      sharePool.push(userInfo, first);
    }
    if (userInfo.grade == 2) {
      first = keywords.shift();
      if (first) {
        sharePool.push(userInfo, first);
      }
      first = keywords.shift();
      if (first) {
        sharePool.push(userInfo, first);
      }
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

  sharePool.end(user, doc);

  var my = userPool[user];
  if (!my) return;
  //需要优化的会员数据才会加入共享池进行优化
  if (my.myInfo.rankSet == 1) {
    var first = my.mykeywords.shift();
    if (first) {
      sharePool.push(my.myInfo, first);
    }

    if (my.myInfo.grade == 2) {
      first = my.mykeywords.shift();
      if (first) {
        sharePool.push(my.myInfo, first);
      }
      first = my.mykeywords.shift();
      if (first) {
        sharePool.push(my.myInfo, first);
      }
    }
  }
}

//用户离开
function userLeave(user) {
  if (!userPool[user]) return;
  User.findOne({ userName: user })
    .then(doc => {
      doc.status = 0;
      doc.save();
      userPool[user].myInfo = doc.toObject();
      setTimeout(() => {
        if (!userPool[user]) return;
        var myuser = userPool[user].myInfo;
        if(!myuser)return;
        if (myuser.status === 0) {
          console.log("用户30秒未登录,删除数据");
          delete userPool[user];
        }
      }, 30000);
    })
    .catch(err => {
      console.log(err);
    });
}

//用户请求资源
function req(user) {
  var my = userPool[user];
  //console.log("userPool[user]=", userPool[user]);
  if (my === undefined) return "disconnect";
  var result = sharePool.shift(user);
  //只检查的用户，一次获取1条共享池数据同时获取一条自己的数据检查排名
  if (my.myInfo.rankSet == 2) {
    var first = my.mykeywords.shift();
    if (first == undefined) return result;
    console.log("first", first);
    var next = moment().add(10, "seconds");
    first.runTime = next.format("YYYY-MM-DD HH:mm:ss");
    if (first) {
      result.push(first);
    }
  }
  return result;
}

function isOnline(user) {
  //console.log('isOnline', userPool[user])
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
  isOnline: isOnline
};
