"use strict";

var axios = require("axios");
var jobContext = require("./jobContext");
var jobAction = require("./jobAction");
var logger = require("../logger");
const auth = require("../auth");
var schedule = require("node-schedule");
//var store = require('./localStore')
var taskRouter = require("./taskRouter");
const messager = require("./ipcSender");
var client = require("./socketClient");

class PolishJober {
  static async isOnline() {
    const access_token = auth.getToken().access_token;
    const url = `${process.env.REACT_APP_API_URL}/user/isOnline`;
    return axios({
      method: "get",
      url,
      headers: {
        Authorization: `Bearer ${access_token}`
      }
    });
  }

  static async execute() {
    //var docs = store.getKeywordLocalStorage();
    var docs = jobContext.list(jobAction.Polish);
   
    if (docs.length > 0) {
      return;
      //store.setKeywordLocalStorage(docs);
    }
   
    docs = await this._fetchData();
    //重新启动及时信息服务
    if (docs == "disconnect") {
      auth.waitUtilGetToken(client.main);
      return;
    }
    console.log("fetch polish tasks length", docs.length);
    this.itemsPush(docs);
  }

  static singlePush(doc) {
    doc.state = "origin";
    var task = {
      doc,
      action: jobAction.Polish,
      end: this.taskFinishedCallback
    };
    jobContext.addTask(task);
    var date = new Date(doc.runTime);
    logger.info("singlePush", doc);
    schedule.scheduleJob(
      date,
      function(task) {
        logger.info("scheduleJob time=", Date.now().toString());
        const doc = task.doc;
        if (jobContext.busy) {
          return;
        }
        if (doc.state == "dirty") {
          logger.info("doc dirty", doc);
          return;
        }
        console.log("schedule time polish", doc);

        taskRouter.execute(task).then(() => {
          //messager("pageRefresh");
          jobContext.removeTask(task);
          console.log("jobContext.removeTask ", jobContext.tasks);
          //store.removeItem(doc._id);
        });
      }.bind(null, task)
    );
  }

  static itemsPush(docs) {
    var doc = docs.shift();
    while (doc) {
      this.singlePush(doc);
      doc = docs.shift();
    }
  }

  //关键词已擦亮
  //doc:已经擦亮的关键词
  static async taskFinishedCallback(doc) {
    //作废，polish由localScanJober执行
    return;

    if (doc.rank == null) return;

    const access_token = auth.getToken().access_token;
    const url = `${process.env.REACT_APP_API_URL}/kwTask/polish`;
    axios({
      method: "post",
      url,
      data: doc,
      headers: {
        Authorization: `Bearer ${access_token}`
      }
    })
      .then(function(response) {
        //messager("pageRefresh");
        messager("message", `已赚到一个优币,保持程序运行,继续赚优币!`);
        //console.log(response)
        //logger.info("polish post", response.data);
      })
      .then(function(err) {
        logger.info(err);
      });
  }

  //获取待擦亮关键词列表
  static async _fetchData() {
    const access_token = auth.getToken().access_token;
    //console.log('call',`${process.env.REACT_APP_API_URL}/kwTask/tasks`)
    try {
      const url = `${process.env.REACT_APP_API_URL}/kwTask/tasks`;
      const res = await axios({
        method: "get",
        url,
        headers: {
          Authorization: `Bearer ${access_token}`
        }
      });
      return res.data;
    } catch (e) {
      return [];
    }
  }
}

module.exports = PolishJober;
