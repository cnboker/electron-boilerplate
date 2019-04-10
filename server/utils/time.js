var moment = require("moment");
var random = require("./random");

module.exports.getRuntime = function() {
  var inDoTasksTime = (() => {
    var startTime = 8 * 60;
    var endTime = 19 * 60 + 30;
    var d = new Date();
    var nowTime = d.getHours() * 60 + d.getMinutes();
    return nowTime > startTime && nowTime < endTime;
  })();
  var min = 10 * 60; //2min
  var max = 60 * 60; // 10min
  if (!inDoTasksTime) {
    min = 30 * 60; //1min
    max = 90 * 60; // 60min
  }

  var next = moment().add(random(min, max), "seconds");
  return next.format("YYYY-MM-DD HH:mm:ss");
};


module.exports.isWorktime = function() {
  var startTime = 9 * 60;
  var endTime = 17 * 60;
  var d = new Date();
  var nowTime = d.getHours() * 60 + d.getMinutes();
  var week = moment().day;
  return (
    nowTime > startTime &&
    nowTime < endTime &&
    week != 5 &&
    week != 6 &&
    week != 7
  );
};
