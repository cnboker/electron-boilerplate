module.exports = function(app) {
  var ctl = require("./Controller");
  app.route("/api/promotion").post(ctl.reqRewardCode);
  app.route("/api/promotion/:id").get(ctl.trace);
};
