
var schedule = require('node-schedule');
var moment = require('moment');
var path = require('path')

//必要,electron node是6.5版本，需要增加babel转换async
// require("babel-register")({
//     // This will override `node_modules` ignoring - you can alternatively pass
//     // an array of strings to be explicitly matched or a regex / glob
//     //ignore: false
//   });

var PolishJober = require('./polishJober');
var ScanerJober = require('./scanJober');
var pageTaskJober = require('./pageTaskJob');
var jobContext = require('./jobContext');

var logger = require('../logger')


module.exports = {
     doTask() {
        logger.info('doTask start ...')    
        //隔15分钟执行scanJober
        schedule.scheduleJob('*/15 * * * *',function(){
            logger.log('/15m', moment().format())
            ScanerJober.execute(jobContext);
        })

        //隔10分钟执行polishJober
        schedule.scheduleJob('*/10 * * * *',function(){
            logger.log('/10m', moment().format())
            PolishJober.execute(jobContext);
        })

        //隔2分钟执行pageTaskJober
        schedule.scheduleJob('*/2 * * * *',function(){
            logger.log('/2m', moment().format())
            try{
                pageTaskJober.execute(jobContext);
            }catch(e){
                logger.error(e);
            }
        })

      
    }
}