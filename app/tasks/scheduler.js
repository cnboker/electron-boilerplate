var schedule = require('node-schedule');

var polishJober = require('./polishJober');
var scanJober = require('./scanJober');
var jobContext = require('./jobContext');
var jobRouter = require('./taskRouter')

var logger = require('../logger')
const auth = require('../auth')
const messager = require('./ipcSender');

function doTask(puppeteerCreator) {
    logger.info('doTask start ...')
   // ipcSendMessage('message', 'task start')
   messager('message','检查离线包下载..')
    var downloader = require('./downloader/resloader')
    downloader(function(success){
        if(success){
            logger.info('download finished...')
            messager('message','准备就绪优化启动..')
            jobContext.puppeteer = puppeteerCreator();
            auth.waitUtilGetToken(main);
        }else{
            logger.info('downloader failure,retry doTask start ...')
            messager('message','优化离线包下载失败,正在重试..')
            window.setTimeout(doTask.bind(null,puppeteerCreator), 30000);
        }
    })
    
}

function main(token) {
    logger.info('token is ok', token)
    if(token.userName == 'admin' || token.userName == 'su')return;
    require('./socketClient')
    polishJober.execute();
    scanJober.appStartRun();
    //隔5s执行scanJober
    //*/5 * * * * *
    schedule.scheduleJob('*/5 * * * * *', function () {             
        if (jobContext.busy || jobContext.puppeteer == undefined) return;
        var task = jobContext.popScanTask();
        if (task != null) {
            try {
                logger.info('execute scan task', task.doc)
                jobRouter.execute(task);
            } catch (e) {
                logger.info(e);
            }
        }
    })
}


module.exports = {
    doTask,
    main
}