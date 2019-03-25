module.exports = function (app) {

  var express = require('express'),
    jwt = require('express-jwt'),
    config = require('../config');

  // Validate access_token
  var jwtCheck = jwt({
    secret: config.secret,
    audience: config.audience,
    issuer: config.issuer,

    getToken: function fromHeaderOrQuerystring(req) {
      if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
        return req.headers.authorization.split(' ')[1];
      } else if (req.query && req.query.token) {
        return req.query.token;
      } 
      return null;
    }
  });

  // Check for scope
  function requireScope(scope) {
    return function (req, res, next) {
      var has_scopes = req.user.scope === scope;
      if (!has_scopes) {  
        res.sendStatus(401);
        return;
      }
      next();
    };
  }

  app.use('/api/unRankKeywords', jwtCheck, requireScope('full_access'));
  app.use('/api/keywords', jwtCheck, requireScope('full_access'));
  app.use('/api/websiteOfkeywords', jwtCheck, requireScope('full_access'));
  app.use('/api/keywords/today', jwtCheck, requireScope('full_access'));
  app.use('/api/keyword', jwtCheck, requireScope('full_access'));
  app.use('/api/kwTask/rank',jwtCheck,requireScope('full_access'));
  app.use('/api/kwTask/polish',jwtCheck, requireScope('full_access'));
  app.use('/api/kwTask/tasks',jwtCheck,requireScope('full_access'));
  app.use('/api/kwTask/status',jwtCheck,requireScope('full_access'));
  app.use('/api/profile',jwtCheck,requireScope('full_access'));
  app.use('/api/pay',jwtCheck,requireScope('full_access'));
  app.use('/api/user/list',jwtCheck,requireScope('full_access'));
  app.use('/api/user/setting', jwtCheck, requireScope('full_access'));
  app.use('/api/user/update', jwtCheck, requireScope('full_access'));
  app.use('/api/user/keeper', jwtCheck, requireScope('full_access'));
  app.use('/api/user/isOnline', jwtCheck, requireScope('full_access'));
 
  app.use('/api/pool/sharePool', jwtCheck, requireScope('full_access'));
  app.use('/api/pool/finishedPool', jwtCheck, requireScope('full_access'));
  app.use('/api/pool/userPool', jwtCheck, requireScope('full_access'));
  app.use('/api/analysis/:id', jwtCheck, requireScope('full_access'));

  app.use('/api/event/del', jwtCheck, requireScope('full_access'));
  app.use('/api/event/create', jwtCheck, requireScope('full_access'));
  app.use('/api/event/list', jwtCheck, requireScope('full_access'));

  app.use('/api/sn/list',jwtCheck,requireScope('full_access'));
  app.use('/api/sn/snActivate',jwtCheck, requireScope('full_access'));
  app.use('/api/sn/snCreate',jwtCheck,requireScope('full_access'));
  app.use('/api/agent',jwtCheck,requireScope('full_access'));

  app.use('/api/question/create',jwtCheck,requireScope('full_access'));
  app.use('/api/answers',jwtCheck,requireScope('full_access'));
  app.use('/api/topic/update',jwtCheck,requireScope('full_access'))
  app.use('/api/comments',jwtCheck,requireScope('full_access'));
  app.use('/api/commissions',jwtCheck,requireScope('full_access'));
  app.use('/api/commissionPay',jwtCheck,requireScope('full_access'));

  app.use('/api/vote/create',jwtCheck,requireScope('full_access'));
  app.use('/api/fileUpload',jwtCheck,requireScope('full_access'));
  app.use('/api/fileUpload/:id',jwtCheck,requireScope('full_access'));

  app.use('/api/qr/pending', jwtCheck, requireScope('full_access'));
  app.use('/api/qr/postwxPay', jwtCheck, requireScope('full_access'));
  app.use('/api/qr/confirm', jwtCheck, requireScope('full_access'));
  app.use('/api/qr/cancel', jwtCheck, requireScope('full_access'));
  app.use('/api/qr/list', jwtCheck, requireScope('full_access'));
  app.use('/api/qr/currentKeeper', jwtCheck, requireScope('full_access'));
 
  
}