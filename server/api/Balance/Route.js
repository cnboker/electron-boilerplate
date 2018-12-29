'use strict'

module.exports = function (app) {
  var ctl = require('./Controller')

  app
    .route('/api/balance/all')
    .get(ctl.all)

  app
    .route('/api/pay')
    .post(ctl.pay)

  //获取佣金列表
  app
    .route('/api/commissions')
    .get(ctl.commissions)
  //佣金已付款
  app
    .route('/api/commissionPay')
    .post(ctl.commissionPay)
}