//require('../config')
// var downloader = require('./downloader/resloader')
// downloader(function(result){
//     console.log('download result=', result)
// })

// var schedule = require('node-schedule');
// var moment = require('moment');
// var app = require('./scheduler')


var token = {
    access_token: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJEZW1vX0lzc3VlciIsImF1ZCI6IkRlbW9fQXVkaWVuY2UiLCJleHAiOjE1NjEyNTQzNzYsInNjb3BlIjoiZnVsbF9hY2Nlc3MiLCJzdWIiOiJzY290dCIsImp0aSI6Ik10cW1XdlBCNXBzVXg5NXMiLCJhbGciOiJIUzI1NiIsImlhdCI6MTUzMDE1MDM3Nn0.Ue1pSRuWxE1ojrau9es23rMo7hSMTGlS87k-tflHOOg",
    id_token: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyTmFtZSI6InNjb3R0Iiwicm9sZSI6InVzZXIiLCJpYXQiOjE1Mjc0MzQ3ODgsImV4cCI6MTUzMDAyNjc4OH0.8E_zpIhjdk-sXeVutOg9bjdwTJENngRp-Xgaz2uiBzQ",
    userName: "scott"
};
//app.main(token)
// schedule.scheduleJob('*/5 * * * * *', function () {
//     console.log(moment().format('HH:mm:ss'))
// })
var jobAction = require("./jobAction");
var jobContext = require("./jobContext");
var pageTaskJob = require("./pageTaskJob");

(async () => {

  var task = {
    doc: {
      userName: 'scott',
      engine: 'baidu',
      link: 'ioliz.com',
      keyword: '充电桩监控系统 软件定制',
      originRank: 66,
    },
    action: jobAction.Polish,
    end:  function (doc) {
      console.log('polishjober execute doc rank', doc);
      //done();
    },
  };
  jobContext.puppeteer = require('puppeteer');
  const browser = await jobContext.puppeteer.launch({
    headless: false
  });


  const page = await browser.newPage();

 
  await pageTaskJob.singleTaskProcess( page,task);

})();


