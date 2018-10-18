var boom = require("boom");

var Keyword = require("../api/Keyword/Model");
var User = require("../api/User/Model");

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
  //防止执行2次
  if (userPool[user] === null) return;
  if (userPool[user] === undefined) {
    userPool[user] = null;
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
        status:1
      },
      "_id user originRank dynamicRank keyword link polishedCount",
      {
        sort: {
          createDate: -1,
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
      mykeywords: keywords
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
  //console.log("userPool[user]=", userPool[user]);
  if (userPool[user] === undefined) return [];

  //var point = userPool[user].myInfo.point || 0;
  return sharePool.shift(user);
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
