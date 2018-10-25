module.exports = function(app) {
  var ctl = require("./Controller");

  app.route("/api/event/:id").get(ctl.list);

  app.route("/api/event/create").post(ctl.create);

  app.route("/api/event/:id").delete(ctl.del);
};
