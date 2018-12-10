module.exports = function(app){
  var ctl = require('./Controller')
  //生成激活码
  app.route('/api/sn/snCreate').post(ctl.snCreate);
  //激活码激活
  app.route('/api/sn/snActivate').post(ctl.snActivate);
  //代理商激活码明细
  app.route('/api/sn/list').get(ctl.list);
  //获取代理人信息
  app.route('/api/agent/:id').get(ctl.agent);
}