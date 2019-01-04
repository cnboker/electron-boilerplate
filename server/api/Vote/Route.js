module.exports = function(app) {
  var ctl = require("./Controller");

  app.route("/api/votes/:id").get(ctl.read);

  app.route("/api/vote/create").post(ctl.create);
  
};