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

  app.route('/api/task/rank')
  .post(ctl.rank)

  app.route('/api/task/polish')
  .post(ctl.polish)

  app.route('/api/tasks')
  .get(ctl.tasks)

}