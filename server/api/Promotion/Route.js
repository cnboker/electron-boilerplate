module.exports = function(app) {
  var ctl = require("./Controller");
  app.route("/api/promotion").get(ctl.reqRewardCode);
  app.route("/api/promotion/trace").post(ctl.trace);
};
