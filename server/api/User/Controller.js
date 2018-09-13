"use strict";

var boom = require("boom");
var jwt = require("jsonwebtoken");

var config = require("../../config");
var Balance = require("../Balance/Model");
var User = require("./Model");
var Keyword = require("../Keyword/Model");

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


exports.update = function(req, res, next) {
  if(req.user.sub !== 'admin'){
    throw '不是指定账号'
  }
  User.findOne({
    userName: req.body.userName
  })
    .then(function(doc) {
       doc.locked = req.body.locked;
       return doc.save()
    })
    .then(doc=>{
      res.json(doc)
    })
    .catch(e => {
      return next(boom.badRequest(e));
    });
};


//切换引擎
exports.engineChange = function(req, res, next) {
  User.findOne({
    userName: req.user.sub
  })
    .then(function(doc) {
      console.log(doc);
      if (doc.engine !== req.body.engine) {
        doc.engine = req.body.engine;
        doc.save();
        return doc;
      }
      throw "not update";
    })
    .then(function(doc) {
      console.log("req.body.engine=", req.body.engine, doc.userName);
      return Keyword.update(
        {
          user: doc.userName
        },
        {
          engine: req.body.engine,
          originRank: 0,
          dynamicRank: 0,
          polishedCount: 0
        },
        { multi: true }
      );
    })
    .then(doc => {
      Keyword.find({
        user: req.user.sub
      })
        .lean()
        .exec((err, docs) => {
          if (err) {
            console.log("err", err);
            res.send(err);
            return;
          }
          const taskio = req.app.io.of("/api/task");
          console.log("docs=", docs);
          for (let doc of docs) {
            taskio.to(req.user.sub).emit("keyword_create", doc);
          }
          res.send(docs);
        });
    })
    .catch(function(e) {
      return next(boom.badRequest(e));
    });
};

//get user list
exports.list = function(req, res, next) {
  User.find(
    {
      userName: { $ne: "admin" }
    },
    null,
    {
      sort: {
        createDate: -1
      }
    }
  )
    .lean()
    .exec(function(err, docs) {
      if (err) {
        return res.end(err);
      }
      Keyword.aggregate([
        {
          $group: {
            _id: "$user",
            count: { $sum: 1 }
          }
        }
      ])
        .then(function(gr) {
          console.log("keyword group by", gr);
          for (let doc of docs) {
            doc.isOnline = req.app.clients[doc.userName] !== undefined;
            var grResult = gr.filter(function(val) {
              return val._id == doc.userName;
            });
            doc.keywordCount = 0;
            if (grResult.length > 0) {
              doc.keywordCount = grResult[0].count;
            }
            doc.userTypeText = userGrade(doc.grade || 1);
          }
          res.json(docs);
        })
        .catch(function(err) {
          console.log(err);
        });
      //exec end
    });

  //end
};

exports.profile = function(req, res, next) {
  var userName = req.user.sub;
  const profile = {
    userName: "",
    grade: "",
    expiredDate: "",
    balance: []
  };
  var query = User.where({
    userName
  });

  query
    .findOne()
    .then(function(doc) {
      profile.userName = doc.userName;
      profile.grade = userGrade(doc.grade);
      profile.gradeValue = doc.grade;
      profile.expiredDate = doc.vipExpiredDate;

      return profile;
    })
    .then(function(profile) {
      return Balance.find(
        {
          user: req.user.sub
        },
        null,
        {
          sort: {
            createDate: -1
          }
        }
      );
    })
    .then(function(docs) {
      profile.balance = docs;
      res.json(profile);
    })
    .catch(function(e) {
      return next(boom.badRequest(e));
    });
};

exports.signup = function(req, res, next) {
  var userName = req.body.userName;
  var password = req.body.password;
  var email = req.body.email;
  if (!userName || !password || !email) {
    return res
      .status(400)
      .send("you must send the userName , the password, the email");
  }

  User.findOne({
    $or: [
      {
        userName
      },
      {
        email
      }
    ]
  })
    .then(doc => {
      if (doc) {
        throw `用户${userName}或${email}已存在`;
      }
      var user = new User({
        ...req.body,
        createDate: new Date(),
        actived: true,
        locked: false,
        grade: 1, //free account
        todayPoint: 50,
        totalPoint: 50,
        lostPoint: 0,
        engine: "baidu"
      });

      return user.save();
    })
    .then(doc => {
      if (doc) {
        console.log("signup", doc);
        var jwtJson = {
          id_token: createIdToken({
            userName,
            role: "user"
          }),
          access_token: createAccessToken(userName)
        };
        console.log("jwtJson", jwtJson);
        res.status(201).json(jwtJson);
      }
    })
    .catch(e => {
      res.status(400).send(e);
    });
};

exports.login = function(req, res) {
  var userName = req.body.userName;
  var password = req.body.password;
  if (!userName || !password) {
    return res.status(400).send("you must send the userName and the password");
  }
  var query = User.where({
    userName
  });

  query.findOne(function(err, doc) {
    if (err) {
      return res.status(500).send(err);
    }

    if (doc) {
      if (doc.password === password) {
        var jwtJson = {
          id_token: createIdToken({
            userName,
            role: "user"
          }),
          access_token: createAccessToken(userName),
          userName,
          engine: doc.engine,
          role: "user"
        };
        //console.log('jwtJson', jwtJson);
        res.status(200).json(jwtJson);
      } else {
        return res.status(400).send(`账号或密码错误`);
      }
    } else {
      return res.status(400).send(`账号或密码错误`);
    }
  });
};

//ref
//https://github.com/auth0-blog/nodejs-jwt-authentication-sample/blob/master/user-routes.js

function createIdToken(user) {
  return jwt.sign(user, config.secret, {
    expiresIn: 60 * 60 * 24 * 360
  });
}

function createAccessToken(userName) {
  return jwt.sign(
    {
      iss: config.issuer,
      aud: config.audience,
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 360,
      scope: "full_access",
      sub: userName,
      jti: genJti(), // unique identifier for the token
      alg: "HS256"
    },
    config.secret
  );
}

// Generate Unique Identifier for the access token
function genJti() {
  let jti = "";
  let possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < 16; i++) {
    jti += possible.charAt(Math.floor(Math.random() * possible.length));
  }

  return jti;
}
