//require('../config')
// var downloader = require('./downloader/resloader')
// downloader(function(result){
//     console.log('download result=', result)
// })

// var schedule = require('node-schedule');
// var moment = require('moment');
// var app = require('./scheduler')

var token = {
  access_token:
    "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJEZW1vX0lzc3VlciIsImF1ZCI6IkRlbW9fQXVkaWVuY2UiLCJleHAiOjE1NjEyNTQzNzYsInNjb3BlIjoiZnVsbF9hY2Nlc3MiLCJzdWIiOiJzY290dCIsImp0aSI6Ik10cW1XdlBCNXBzVXg5NXMiLCJhbGciOiJIUzI1NiIsImlhdCI6MTUzMDE1MDM3Nn0.Ue1pSRuWxE1ojrau9es23rMo7hSMTGlS87k-tflHOOg",
  id_token:
    "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyTmFtZSI6InNjb3R0Iiwicm9sZSI6InVzZXIiLCJpYXQiOjE1Mjc0MzQ3ODgsImV4cCI6MTUzMDAyNjc4OH0.8E_zpIhjdk-sXeVutOg9bjdwTJENngRp-Xgaz2uiBzQ",
  userName: "scott"
};
//app.main(token)
// schedule.scheduleJob('*/5 * * * * *', function () {
//     console.log(moment().format('HH:mm:ss'))
// })
var jobAction = require("./jobAction");
var jobContext = require("./jobContext");
var pageTaskJob = require("./pageTaskJob");
var polishJober = require("./polishJober");
var logger = require("../logger");
const auth = require("../auth");
var client = require("./socketClient");
process.node_debug = true;
(async () => {
  var task = {
    doc: {
      userName: "scott1",
      engine: "baidu",
      link: "ioliz.com",
      keyword: "数字标牌内容发布系统 定制开发",
      originRank: 64,
      dynamicRank: 0
    },
    action: jobAction.Polish,
    end: function(doc) {
      console.log("polishjober execute doc rank", doc);
      //done();
    }
  };
  jobContext.puppeteer = require("puppeteer");
  // const browser = await jobContext.puppeteer.launch({
  //   headless: false
  // });

  // const page = await browser.newPage();

  await pageTaskJob.execute(task);
  //await pageTaskJob.singleTaskProcess(page,task);

  //   jobContext.puppeteer = require('puppeteer');
  //  var promise = polishJober.isOnline();
  //     promise
  //       .then(response => {
  //         if (response.data) {
  //           logger.info('check is online, client is online')
  //           polishJober.execute();
  //         } else {
  //           //reconnect

  //           logger.info('check is online, client is offline, reconnect')
  //           auth.waitUtilGetToken(client.main);
  //         }
  //       })
  //       .catch(e => {
  //         ////reconnect
  //         auth.waitUtilGetToken(client.main);
  //       });
  // jobContext.puppeteer = require("puppeteer");
  // const worder = require("./wordExtender");
  // var result = await worder
  // .search('软件定制')
  // logger.info("wordQuery result",result);

})();
