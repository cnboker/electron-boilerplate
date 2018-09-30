'use strict';

module.exports = function(app){
  var ctl = require('./Controller');

  app.route('/api/keywords')
  .get(ctl.list)
  .post(ctl.create)

  app.route('/api/keyword/:id')
  .get(ctl.read)
  .put(ctl.update)
  .delete(ctl.delete)

  app.route('/api/kwTask/rank')
  .post(ctl.rank)

  app.route('/api/kwTask/polish')
  .post(ctl.polish)

  app.route('/api/kwTask/tasks')
  .get(ctl.tasks)

  app.route('/api/keywords/today')
  .get(ctl.today)

  app.route('/api/pool/sharePool')
  .get(ctl.sharePool)

  app.route('/api/pool/finishedPool')
  .get(ctl.finishedPool)
 
}