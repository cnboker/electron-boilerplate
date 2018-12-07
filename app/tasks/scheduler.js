var schedule = require("node-schedule");

var polishJober = require("./polishJober");
var scanJober = require("./scanJober");
var jobContext = require("./jobContext");
var jobRouter = require("./taskRouter");

var logger = require("../logger");
const auth = require("../auth");
const messager = require("./ipcSender");
var jobAction = require("./jobAction");

function doTask(puppeteerCreator) {
  logger.info("doTask start ...");
  // ipcSendMessage('message', 'task start')
  messager("message", "检查离线包下载..");
  var downloader = require("./downloader/resloader");
  downloader(function(success) {
    if (success) {
      logger.info("download finished...");
      messager("message", "准备就绪优化启动..");
      var obj = puppeteerCreator();
      jobContext.puppeteer = obj.puppeteer;
      jobContext.ipc = obj.ipc;
      auth.waitUtilGetToken(main);
    } else {
      logger.info("downloader failure,retry doTask start ...");
      messager("message", "离线包下载失败,正在重试..");
      window.setTimeout(doTask.bind(null, puppeteerCreator), 30000);
    }
  });
}
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

function main(token) {
  logger.info("token is ok", token);
  if (token.userName == "admin" || token.userName == "su") return;

  //使用进程间通讯替代socket通讯
  require('./frontEvent')(jobContext.ipc)
  
  var client = require("./socketClient");
  client.main(token)
  scanJober.originRankCheck();
  //隔5s执行scanJober
  //*/5 * * * * *
  schedule.scheduleJob("*/5 * * * * *", function() {
    if (jobContext.busy || jobContext.puppeteer == undefined) return;
    var task = jobContext.popTask(jobAction.SCAN);
    if (task != null) {
      try {
        logger.info("execute scan task", task.doc);
        jobRouter.execute(task);
      } catch (e) {
        logger.info(e);
      }
    }
  });

  schedule.scheduleJob("*/2 * * * *", function() {
    polishJober.execute();
  });
  //end
}

module.exports = {
  doTask,
  main
};
