
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


var log4js = require('log4js');
var logger = log4js.getLogger();
logger.level = 'info';
logger.debug("Some debug messages");

process.env.REACT_APP_API_URL = 'http://localhost:3001/api';
process.env.REACT_APP_AUTH_URL = 'http://localhost:3001';

module.exports = {
     doTask() {
        logger.log('doTask start ...')
        //隔30分钟执行scanJober
        schedule.scheduleJob('*/2 * * * *',function(){
            console.log('/30m', moment().format())
            ScanerJober.execute(jobContext);
        })

        //隔10分钟执行polishJober
        schedule.scheduleJob('*/2 * * * *',function(){
            console.log('/10m', moment().format())
            PolishJober.execute(jobContext);
        })

        //隔1分钟执行pageTaskJober
        schedule.scheduleJob('*/1 * * * *',function(){
            console.log('/1m', moment().format())
            pageTaskJober.execute(jobContext);
        })
    }
}