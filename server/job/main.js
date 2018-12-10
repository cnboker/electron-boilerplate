var schedule = require("node-schedule");
var logger = require("../logger");
var User = require('../api/User/Model')
var Keyword = require('../api/Keyword/Model')
require('../utils/groupBy')
/*
*    *    *    *    *    *
┬    ┬    ┬    ┬    ┬    ┬
│    │    │    │    │    |
│    │    │    │    │    └ day of week (0 - 7) (0 or 7 is Sun)
│    │    │    │    └───── month (1 - 12)
│    │    │    └────────── day of month (1 - 31)
│    │    └─────────────── hour (0 - 23)
│    └──────────────────── minute (0 - 59)
└───────────────────────── second (0 - 59, OPTIONAL)
*/
var vipJob = require('./vipcheckJob')

function doJob() {
  //隔5s执行scanJober */5 * * * * *
  schedule
    .scheduleJob("*/5 * * * * *", function () {
      console.log('vip job')
      vipJob();
      console.log('vip job end')
    });
  //per m
  schedule.scheduleJob("*/2 * * * *", function () {});
  //end
}

doJob();
