'use strict';

module.exports = function(app){
  var ctl = require('./Controller');

  app.route('/api/login')
  .post(ctl.login)

  app.route('/api/signup')
  .post(ctl.signup)
}

