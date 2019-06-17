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

  app.route('/api/keyword')
  .delete(ctl.delete)

  app.route('/api/keywords/tagUpdate')
  .put(ctl.keywordsTagUpdate)

  app.route('/api/kwTask/rank')
  .post(ctl.rank)

  app.route('/api/kwTask/polish')
  .post(ctl.polish)

  app.route('/api/kwTask/tasks')
  .get(ctl.tasks)

  app.route('/api/keywords/today')
  .get(ctl.today)

  app.route('/api/pool/taskPool')
  .get(ctl.taskPool)

  app.route('/api/analysis/:id')
  .get(ctl.history)

  app.route('/api/unRankKeywords')
  .get(ctl.unRankKeywords)

  app.route('/api/websiteOfkeywords')
  .get(ctl.websiteOfkeywords)
}