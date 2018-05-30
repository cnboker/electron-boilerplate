var schedule = require('node-schedule');
var moment = require('moment');

var jobService = require('./baidu/jobService');
var jobContext = require('./baidu/jobContext');

module.exports = {
    async doTask() {
        await jobContext.browserPerpare();
        schedule.scheduleJob('30 * * * * *', function () {
            jobService.run();
        });
    }
}