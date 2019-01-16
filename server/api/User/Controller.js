"use strict";

var boom = require("boom");
var jwt = require("jsonwebtoken");

var config = require("../../config");
var Balance = require("../Balance/Model");
var User = require("./Model");
var Keyword = require("../Keyword/Model");
var keywordPool = require("../../socket/keywordPool");
var RewardCode = require('./RewardModel');

function userGrade(grade) {
  if (grade == 1) {
    return "免费账号";
  } else if (grade == 2) {
    return "VIP账号";
  } else if (grade == 3) {
    return "企业账户";
  } else {
    return "未知";
  }
}

exports.forgetpassword = function (req, res, next) {
  //console.log(req.body)
  User
    .findOne({userName: req.body.userName, email: req.body.mail})
    .then((doc) => {
      return res.send(doc != null)
    })
    .catch(e => {
      return next(boom.badRequest(e));
    })
}

exports.resetpassword = function (req, res, next) {
  // console.log(req.body)
  User
    .findOne({userName: req.body.userName})
    .then((doc) => {
      doc.password = req.body.newpassword;
      return doc.save();
    })
    .then(doc => {
      res.json(doc);
    })
    .catch(e => {
      return next(boom.badRequest(e));
    })
}

exports.isOnline = function (req, res) {
  return res.send(keywordPool.isOnline(req.user.sub));
};

exports.update = function (req, res, next) {
  if (req.user.sub !== "admin") {
    throw "不是指定账号";
  }
  User
    .findOne({userName: req.body.userName})
    .then(function (doc) {
      doc.locked = req.body.locked;
      return doc.save();
    })
    .then(doc => {
      res.json(doc);
    })
    .catch(e => {
      return next(boom.badRequest(e));
    });
};

exports.setting = function (req, res, next) {
  User.update({
    userName: req.user.sub
  }, {
      engine: req.body.engine,
      rankSet: req.body.rankSet
    })
    .then(function (doc) {
      res.json(doc);
    })
    .catch(function (e) {
      return next(boom.badRequest(e));
    });
};

//切换引擎
function engineChange(req, res, next) {
  User
    .findOne({userName: req.user.sub})
    .then(function (doc) {
      //console.log(doc);
      if (doc.engine !== req.body.engine) {
        doc.engine = req.body.engine;
        doc.save();
        return doc;
      }
      throw "not update";
    })
    .then(function (doc) {
      //console.log("req.body.engine=", req.body.engine, doc.userName);
      return Keyword.update({
        user: doc.userName
      }, {
        engine: req.body.engine,
        originRank: 0,
        dynamicRank: 0,
        polishedCount: 0
      }, {multi: true});
    })
    .then(doc => {
      Keyword
        .find({user: req.user.sub})
        .lean()
        .exec((err, docs) => {
          if (err) {
            // console.log("err", err);
            res.send(err);
            return;
          }

          for (let doc of docs) {
            req
              .socketServer
              .keywordCreate(doc);
          }
          res.send(docs);
        });
    })
    .catch(function (e) {
      return next(boom.badRequest(e));
    });
}

//get user list
exports.list = function (req, res, next) {
  var query = {};
  if (req.query.status >= 0) {
    query.status = req.query.status;
  } else {
    if (req.query.grade > 0) {
      query.grade = req.query.grade;
    }
    if (req.query.name) {
      query.userName = {
        $regex: ".*" + req.query.name + ".*",
        $ne: "admin"
      };
    }
    query.createDate = {
      $gt: req.query.startDate,
      $lt: req.query.endDate
    };
  }
  console.log('query:', query)
  Promise.all([
    Keyword.aggregate([
      {
        $group: {
          _id: "$user",
          count: {
            $sum: 1
          }
        }
      }
    ]),

    User.paginate(query, {
      page: + req.query.page + 1,
      limit: + req.query.limit
    }, {
      sort: {
        createDate: -1
      }
    })
  ]).then(([gr, result]) => {
    //x1--group x2--pagination
    /**
       * Response looks like:
       * {
       *   docs: [...] // array of Posts
       *   total: 42   // the total number of Posts
       *   limit: 10   // the number of Posts returned per page
       *   page: 2     // the current page of Posts returned
       *   pages: 5    // the total number of pages
       * }
       */
    result.docs = result
      .docs
      .map(x => {
        var doc = x.toObject();
        var grResult = gr.filter(function (val) {
          return val._id == doc.userName;
        });
        doc.keywordCount = 0;
        if (grResult.length > 0) {
          doc.keywordCount = grResult[0].count;
        }
        doc.userTypeText = userGrade(doc.grade || 1);
        return doc;
      });

    res.json(result);
  }).catch(e => {
    return next(boom.badRequest(e));
  });
};

exports.profile = function (req, res, next) {
  Promise.all([
    User.findOne({userName: req.user.sub}),
    Balance.find({
      user: req.user.sub
    }, null, {
      sort: {
        createDate: -1
      }
    })
  ]).then(([user, list]) => {
    var profile = {};
    profile.userName = user.userName;
    profile.grade = userGrade(user.grade);
    profile.gradeValue = user.grade;
    profile.expiredDate = user.vipExpiredDate;
    profile.rank = user.rank;
    profile.rewardCode = user.rewardCode;
    profile.balance = list
    res.json(profile)
  }).catch(e => {
    return next(boom.badRequest(e))
  })
};

exports.signup = async function (req, res, next) {
  var userName = req.body.userName;
  var password = req.body.password;
  var email = req.body.email;
  if (!userName || !password || !email) {
    return res
      .status(400)
      .send("必须输入手机号或邮箱");
  }

  if (req.body.reference) {
    var reference = await User.findOne({rewardCode: req.body.reference})
    if (!reference) {
       res
        .status(400)
        .send(`推荐码${req.body.reference}不存在`);
        return;
    }
  }

  User.findOne({
    $or: [{
        userName
      }, {
        email
      }]
  }).then(async doc => {
    if (doc) {
      throw `用户${userName}或${email}已存在`;
    }
    var rc = await RewardCode.findOne({isUsed:false})
    rc.isUsed =true;
    await rc.save();
    console.log('rewardCode=', rc)
    var user = new User({
      ...req.body,
      createDate: new Date(),
      actived: true,
      locked: false,
      grade: 1, //free account
      todayPoint: 50,
      totalPoint: 50,
      lostPoint: 0,
      engine: "baidu",
      point: 0,
      rewardCode:rc.code
    });

    return user.save();
  }).then(doc => {
    if (doc) {
      //console.log("signup", doc);
      var jwtJson = {
        id_token: createIdToken({userName, role: "user"}),
        access_token: createAccessToken(userName),
        userName,
        engine: 'baidu',
        rankSet: 1,
        role: "user"
      };
      //console.log("jwtJson", jwtJson);
      res
        .status(201)
        .json(jwtJson);
    }
  }).catch(e => {
    res
      .status(400)
      .send(e);
  });
};

exports.login = function (req, res) {
  var userName = req.body.userName;
  var password = req.body.password;
  if (!userName || !password) {
    return res
      .status(400)
      .send("you must send the userName and the password");
  }
  Promise.all([
    User.findOne({userName}),
    Keyword.findOne({user: userName})
  ]).then(([user, kw]) => {
    if (!user) {
      return res
        .status(400)
        .send(`账号不存在`);
    }
    if (user.password != password) {
      return res
        .status(400)
        .send(`账号或密码错误`);
    }
    var promise = new Promise((resolve, reject) => {
      if (kw && kw.engine != user.engine) {
        Keyword.update({
          user: userName
        }, {
          engine: user.engine,
          originRank: 0,
          dynamicRank: 0,
          polishedCount: 0
        }, {multi: true}).then(() => {
          //console.log('resolve')
          resolve(user);
        }).catch(e => {
          reject(e);
        });
      } else {
        resolve(user)
      }
    });

    promise.then(user => {
      var jwtJson = {
        id_token: createIdToken({userName, role: "user"}),
        access_token: createAccessToken(userName),
        userName,
        engine: user.engine,
        rankSet: user.rankSet,
        role: "user"
      };
      //console.log('jwtJson', jwtJson);
      res
        .status(200)
        .json(jwtJson);
    });
  }).catch(e => {
    console.log(e);
  });
};

// ref
// https://github.com/auth0-blog/nodejs-jwt-authentication-sample/blob/master/us
// e r-routes.js

function createIdToken(user) {
  return jwt.sign(user, config.secret, {
    expiresIn: 60 * 60 * 24 * 360
  });
}

function createAccessToken(userName) {
  return jwt.sign({
    iss: config.issuer,
    aud: config.audience,
    exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 360,
    scope: "full_access",
    sub: userName,
    jti: genJti(), // unique identifier for the token
    alg: "HS256"
  }, config.secret);
}

// Generate Unique Identifier for the access token
function genJti() {
  let jti = "";
  let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < 16; i++) {
    jti += possible.charAt(Math.floor(Math.random() * possible.length));
  }

  return jti;
}
