'use strict'

var boom = require('boom')
var jwt = require('jsonwebtoken')

var config = require('../../config')
var Balance = require('../Balance/Model')
var User = require('./Model');


function userGrade(grade) {
  if (grade == 1) {
    return '免费账号';
  } else if (grade == 2) {
    return 'VIP账号'
  } else if (grade == 3) {
    return '企业账户'
  } else {
    return '未知'
  }
}

exports.profile = function (req, res,next) {
  var userName = req.user.sub;
  const profile = {
    userName: '',
    grade: '',
    expiredDate: '',
    balance: []
  }
  var query = User.where({
    userName
  });

  query
    .findOne()
    .then(function (doc) {
      profile.userName = doc.userName;
      profile.grade = userGrade(doc.grade);
      profile.gradeValue = doc.grade;
      profile.expiredDate = doc.vipExpiredDate;

      return profile;
    })
    .then(function (profile) {
      return Balance.find({
        'user': req.user.sub
      },null,{
        sort:{
          createDate:-1
        }
      })
    }).then(function (docs) {
      profile.balance = docs;
      res.json(profile)
    })
    .catch(function (e) {
      return next(boom.badRequest(e));
    })
}

exports.signup = function (req, res) {
  var userName = req.body.userName;
  var password = req.body.password;
  var email = req.body.email;
  if (!userName || !password || !email) {
    return res.status(400).send("you must send the userName , the password, the email")
  }
  var query = User.where({
    userName
  });
  query.findOne(function (err, entity) {
    if (err) {
      return res.status(500).send(err)
    }
    if (entity) {
      return res.status(400).send(`用户${userName}已存在`)
    }
  })
  query = User.where({
    email
  });
  query.findOne(function (err, entity) {
    if (err) return res.status(500).send(err);
    if (entity) return res.status(400).send(`email${email}已存在`)
  })

  var user = new User({ ...req.body,
    createDate: Date.now(),
    actived: true,
    locked: false
  });

  user.save(function (err, entity) {
    if (err) {
      res.send(err);
    }
    if (entity) {
      var jwtJson = {
        id_token: createIdToken({
          userName,
          role: 'user'
        }),
        access_token: createAccessToken(entity.userName)
      };
      //console.log('jwtJson', jwtJson);
      res.status(201).json(jwtJson);
    }
  });
}


exports.login = function (req, res) {
  var userName = req.body.userName;
  var password = req.body.password;
  if (!userName || !password) {
    return res.status(400).send("you must send the userName and the password")
  }
  var query = User.where({
    userName
  });

  query.findOne(function (err, doc) {
    if (err) {
      return res.status(500).send(err)
    }

    if (doc) {
      if (doc.password === password) {
        var jwtJson = {
          id_token: createIdToken({
            userName,
            role: 'user'
          }),
          access_token: createAccessToken(userName)
        };
        //console.log('jwtJson', jwtJson);
        res.status(200).json(jwtJson);
      } else {
        return res.status(400).send(`账号或密码错误`)
      }
    } else {
      return res.status(400).send(`账号或密码错误`)
    }
  })
}

//ref
//https://github.com/auth0-blog/nodejs-jwt-authentication-sample/blob/master/user-routes.js


function createIdToken(user) {
  return jwt.sign(user, config.secret, {
    expiresIn: 60 * 60 * 24 * 360
  });
}

function createAccessToken(userName) {
  return jwt.sign({
    iss: config.issuer,
    aud: config.audience,
    exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 360),
    scope: 'full_access',
    sub: userName,
    jti: genJti(), // unique identifier for the token
    alg: 'HS256'
  }, config.secret);
}

// Generate Unique Identifier for the access token
function genJti() {
  let jti = '';
  let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < 16; i++) {
    jti += possible.charAt(Math.floor(Math.random() * possible.length));
  }

  return jti;
}