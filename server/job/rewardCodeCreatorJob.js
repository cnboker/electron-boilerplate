var RewardCode = require("../api/User/RewardModel");
var ph = require("../utils/passwordHash");

module.exports = function() {
  var docs = [];

  for (var i = 0; i < 10000; i++) {
    var sn = ph.radmon(4);
    if (docs.indexOf(sn) == -1) {
      docs.push(sn);
    }
  }
  var model = docs.map(x => {
    return { code: x, isUsed: false };
  });
  return RewardCode.insertMany(model);
};
