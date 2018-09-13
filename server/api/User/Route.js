'use strict';

module.exports = function(app){
  var ctl = require('./Controller');

  app.route('/api/login')
  .post(ctl.login)

  app.route('/api/signup')
  .post(ctl.signup)

  app.route('/api/profile')
  .get(ctl.profile)

  app.route('/api/user/list')
  .get(ctl.list)

  app.route('/api/user/engineChange')
  .put(ctl.engineChange);

  app.route('/api/user/update')
  .put(ctl.update);
}

