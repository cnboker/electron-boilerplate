var schedule = require('node-schedule');
var moment = require('moment');
var path = require('path')

//必要,electron node是6.5版本，需要增加babel转换async
// require("babel-register")({
//     // This will override `node_modules` ignoring - you can alternatively pass
//     // an array of strings to be explicitly matched or a regex / glob
//     //ignore: false
//   });

var polishJober = require('./polishJober');
var pageTaskJober = require('./pageTaskJob');
var jobContext = require('./jobContext');
var logger = require('../logger')
const auth = require('../auth')


function doTask() {
    logger.info('doTask start ...')
    waitUtil(main)
}

function main() {
    logger.info('token is ok')
    require('./socketClient')
    polishJober.execute()
    //隔10s执行scanJober
    schedule.scheduleJob('*/1 * * * *', function () {
        logger.info('/1m', moment().format())
        if (jobContext.busy) return;
        var task = jobContext.popScanTask();
        if (task != null) {
            try {
                logger.info('execute scan task', task.doc)
                pageTaskJober.execute(task);
            } catch (e) {
                logger.error(e);
            }
        }
    })
}

function waitUtil(callback) {
    var token = auth.getToken();
    if (token == null) {
        logger.info('token is null')
        window.setTimeout(waitUtil.bind(null, callback), 1000); /* 将参数callback带入进去*/
    } else {
        if (callback && typeof (callback) === "function") {
            callback();
        }
    }
}

module.exports = {
    doTask
}