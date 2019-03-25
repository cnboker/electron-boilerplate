module.exports = (app) =>{
  var ctl = require('./Controller');
  //获取临时订单,临时订单超过24个小时自动删除
  app.route('/api/qr/pending').get(ctl.pending);
  //用户付款确认
  app.route('/api/qr/postwxPay').post(ctl.postwxPay);
  //后台收款人付款确认
  app.route('/api/qr/confirm').post(ctl.confirm);
  //后台收款人付款取消
  app.route('/api/qr/cancel').post(ctl.cancel)
  //后台收款人返利
  app.route('/api/qr/list').get(ctl.list)
}