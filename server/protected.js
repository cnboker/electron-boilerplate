module.exports = function (app) {

  var express = require('express'),
    jwt = require('express-jwt'),
    config = require('./config');

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
      //console.log('user',req.user)
      var has_scopes = req.user.scope === scope;
      if (!has_scopes) {  
        res.sendStatus(401);
        return;
      }
      next();
    };
  }

  app.use('/api/keywords', jwtCheck, requireScope('full_access'));
  app.use('/api/keyword', jwtCheck, requireScope('full_access'));
  app.use('/api/keyword/rank',jwtCheck,requireScope('full_access'));
  app.use('/api/keyword/polish',jwtCheck, requireScope('full_access'));
  app.use('/api/keyword/tasks',jwtCheck,requireScope('full_access'));
}