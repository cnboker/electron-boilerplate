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

  app.route('/api/user/setting')
  .post(ctl.setting);

  app.route('/api/user/update')
  .put(ctl.update);

  app.route('/api/user/isOnline')
  .get(ctl.isOnline)

  app.route('/api/user/forgetpassword')
  .post(ctl.forgetpassword);
  
  app.route('/api/user/resetpassword')
  .post(ctl.resetpassword);

  app.route('/api/user/keeper')
  .get(ctl.keeper)
}

