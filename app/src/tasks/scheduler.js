var schedule = require('node-schedule');
var moment = require('moment');
var ScanerJober = require('./baidu/scanJober');
var PolishJober = require('./baidu/polishJober');
var pageTaskJober = require('./baidu/pageTaskJob');
var jobContext = require('./baidu/jobContext');
process.env.NODE_ENV = 'test'

module.exports = {
    async doTask() {
        console.log('doTask start ...')
        //隔30分钟执行scanJober
        schedule.scheduleJob('*/1 * * * *',function(){
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