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
}