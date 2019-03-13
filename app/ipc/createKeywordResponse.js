var scanJober = require('../tasks/scanJober')

module.exports = function(event, doc) {
  if(!doc)return;
  return scanJober.execute(doc);
};