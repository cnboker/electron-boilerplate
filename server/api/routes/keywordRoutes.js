'use strict';

module.exports = function(app){
  var ctl = require('../controllers/keywordController');

  app.route('/keywords')
  .get(ctl.list)
  .post(ctl.create)

  app.route('/keyword/:id')
  .get(ctl.read)
  .put(ctl.update)
  .delete(ctl.delete)
}