var schedule = require('node-schedule');
var moment = require('moment');
var scanerJober = require('./baidu/scanJober');
var polishJober = require('./baidu/polishJober');
var pageTaskJober = require('./baidu/pageTaskJob');
var jobContext = require('./baidu/jobContext');

module.exports = {
    async doTask() {
        await jobContext.browserPerpare();
       
        //隔30分钟执行scanJober
        schedule.scheduleJob('30 * * * * *',function(){
            scanerJober.execute(jobContext);
        })

        //隔10分钟执行polishJober
        schedule.scheduleJob('30 * * * * *',function(){
            polishJober.execute(jobContext);
        })

        //隔1分钟执行pageTaskJober
        schedule.scheduleJob('30 * * * * *',function(){
            pageTaskJober();
        })
    }
}