'use strict'

module.exports = function (app) {
  var ctl = require('./Controller')

  app
    .route('/api/pay')
    .post(ctl.pay)

  //获取账单列表
  app
    .route('/api/bill')
    .get(ctl.bill)
  //佣金已付款
  app
    .route('/api/billPay')
    .post(ctl.billPay)
}