var schedule = require('node-schedule');
var moment = require('moment');


var polishJober = require('./polishJober');
var pageTaskJober = require('./pageTaskJob');
var jobContext = require('./jobContext');
var logger = require('../logger')
const auth = require('../auth')


function doTask(puppeteerCreator) {
    logger.info('doTask start ...')
    var downloader = require('./downloader/resloader')
    downloader(function(success){
        if(success){
            logger.info('download finished...')
            jobContext.puppeteer = puppeteerCreator();
            waitUtil(main)
        }else{
            logger.info('downloader failure,retry doTask start ...')
            window.setTimeout(doTask.bind(null,puppeteerCreator), 30000);
        }
    })
    
}

function main() {
    logger.info('token is ok')
    require('./socketClient')
    polishJober.execute()
    //隔10s执行scanJober
    schedule.scheduleJob('*/1 * * * *', function () {
        logger.info('/1m', moment().format())       
        if (jobContext.busy || jobContext.puppeteer == undefined) return;
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