
var schedule = require('node-schedule');
var moment = require('moment');

//process.env.NODE_ENV = 'test'
//必要,electron node是6.5版本，需要增加babel转换async
// require("babel-register")({
//     // This will override `node_modules` ignoring - you can alternatively pass
//     // an array of strings to be explicitly matched or a regex / glob
//     //ignore: false
//   });

var PolishJober = require('./baidu/polishJober');
var ScanerJober = require('./baidu/scanJober');
var pageTaskJober = require('./baidu/pageTaskJob');
var jobContext = require('./baidu/jobContext');

var logger = require('../../logger')

require('dotenv').config({
    path: './.env'
  });
  
module.exports = {
     doTask() {
        logger.info('doTask start ...')
        //隔30分钟执行scanJober
        schedule.scheduleJob('*/1 * * * *',function(){
            logger.log('/30m', moment().format())
            ScanerJober.execute(jobContext);
        })

        //隔10分钟执行polishJober
        schedule.scheduleJob('*/1 * * * *',function(){
            logger.log('/10m', moment().format())
            PolishJober.execute(jobContext);
        })

        //隔1分钟执行pageTaskJober
        schedule.scheduleJob('*/1 * * * *',function(){
            logger.log('/1m', moment().format())
            pageTaskJober.execute(jobContext);
        })
    }
}