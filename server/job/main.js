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
var resetTodayPolishJob = require('./resetTodayPolishCount')
var performanceIndex = require('./perfomanceIndex');

var mongoose = require("mongoose"); //.set('debug', true);
//mongoose add promise ablity Promise.promisifyAll(mongoose); //AND THIS LINE
mongoose.Promise = require("bluebird");
//mongoose.Promise = global.Promise;

(function  doJob() {
  //run every day at 23:00
  schedule
    .scheduleJob("00 00 23 * * 0-6", function () {
      mongoose.connect("mongodb://localhost/kwPolish");
      vipJob().then(()=>{
        console.log('reset')
        return resetTodayPolishJob();
      })
      .then(()=>{
        console.log('performanceIndex')
        return performanceIndex();
      })
      .then(()=>{
        console.log('disconnect')
        mongoose.disconnect();
      })
      .catch(e=>{
        console.log(e)        
      })
    });

  //per m
  schedule.scheduleJob("*/2 * * * *", function () {});
  //end
})();

