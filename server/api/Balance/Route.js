'use strict'

module.exports = function(app){
  var ctl = require('./Controller')

  app.route('/api/balance/all')
  .get(ctl.all)

  app.route('/api/pay')
  .post(ctl.pay)
}