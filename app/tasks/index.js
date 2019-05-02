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

var jobContext = require("./jobContext");
var jobAction = require("./jobAction");
var pageTaskJob = require("./pageTaskJob");
require("../config");
process.node_debug = true;

// const pptr = require("puppeteer");
//   (async () => {
//     const browser = await pptr.launch();
//     console.log(await browser.version());
//     await browser.close();
//   })();
//   return;
(async () => {
  var task = {
    doc: {
      userName: "scott",
      engine: "baidu",
      link: "土工膜土工布",
      keyword: "土工膜",
      originRank: 5,
      dynamicRank: 1
    },
    action: jobAction.Polish,
    end: function(doc) {
      //console.log("polishjober execute doc rank", doc);
      //done();
    }
  };
  jobContext.puppeteer = require("puppeteer");

  

  await pageTaskJob.execute(task);
  //await gpageTaskJober.execute(task)
  //await pageTaskJob.adIndexer()
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

  //  var localScanJober = require('./localScanJober');
  //  localScanJober.scan();
  // await linkClickTest();
  //await titleClickTest();
  //await cheerTest();
  // var wordExtender = require('./wordExtender');
  // var result = await wordExtender.search('软件定制')
  // console.log(result)
})();

async function wordTest(){
  jobContext.puppeteer = require("puppeteer");
  const worder = require("./wordExtender");
  var result = await worder
  .search('软件定制')
}

//通过链接匹配点击测试
async function linkClickTest() {
  var task = {
    doc: {
      userName: "scott",
      engine: "baidu",
      link: "土工膜土工布",
      keyword: "土工膜",
      originRank: 5,
      dynamicRank: 1
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
  // await pageTaskJob.inputKeyword(page,'软件定制服务',false);

  await pageTaskJob.execute(task);
  //await gpageTaskJober.execute(task)
  //await pageTaskJob.adIndexer()
  //await pageTaskJob.singleTaskProcess(page,task);
}
