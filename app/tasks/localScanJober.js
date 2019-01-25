"use strict";

var jobContext = require("./jobContext");
var jobAction = require("./jobAction");
var axios = require("axios");

const auth = require("../auth");
const messager = require("./ipcSender");
var store = require("./localStore");
//本地检测排名
class LocalScanJober {
  constructor() {}

  //获取当日任务，如果任务已经执行完成，返回null
  static async getTask() {
    var docs = store.getKeywordLocalStorage();
    if (docs.length == 0) {
      docs = await this._fetchData();
    }
    if (docs.length == 0) return null;
    var doc = docs.shift();
    store.setKeywordLocalStorage(docs);
    var task = {
      doc,
      action: jobAction.SCAN,
      end: this.taskFinishedCallback
    };
    return task;
  }

  
  //每5分钟执行一次
  static async scan() {
    if (store.isTodayEmpty()) return;
    var task = await this.getTask();
    if (task == null) return;

    console.log("task doc", task.doc);
    var cheer = require("./cheerioPageTaskJob");
    var result = await cheer(jobContext.puppeteer, task.doc);
    task.doc.rank = result.pageIndex;
    task.doc.adIndexer = result.adIndexer;
    task.end(task.doc);

    if (store.isTodayEmpty()) {
      console.log("pagerefresh");
      messager("pageRefresh");
    }

    // const browser = await jobContext.puppeteer.launch({
    //   headless: process.env.NODE_ENV == "production",
    //   //devtools:true,
    //   executablePath: (() => {
    //     return process.env.ChromePath;
    //   })()
    // });

    // const page = await browser.newPage();
    //无痕窗口

    // taskJob.singleTaskProcess(page, task).then(() => {
    //   task.end(task.doc);
    //   browser.close();
    //   //查询完毕刷新界面
    //   if(store.isTodayEmpty()){
    //     console.log('pagerefresh')
    //     messager("pageRefresh");
    //   }
    // });
  }

  static async taskFinishedCallback(doc) {
    const access_token = auth.getToken().access_token;
    const url = `${process.env.REACT_APP_API_URL}/kwTask/polish`;
    axios({
      method: "post",
      url,
      data: { opt: "localScan", ...doc },
      headers: {
        Authorization: `Bearer ${access_token}`
      }
    })
      .then(function(response) {
        //messager("pageRefresh");
        // console.log(response)
        //logger.info("scan post", response.data);
      })
      .then(function(err) {
        // console.error(err)
      })
      .catch(e=>{
        console.error(e)
      })
  }

  static async _fetchData() {
    try {
      const access_token = auth.getToken().access_token;
      const url = `${process.env.REACT_APP_API_URL}/keywords`;
      //logger.info('scanjob-_fetchData-url', url);
      const res = await axios({
        method: "get",
        url,
        headers: {
          Authorization: `Bearer ${access_token}`
        }
      });
      const json = res.data;
      return json.filter(x => x.originRank > 0);
    } catch (e) {
      console.log(e);
      return [];
    }
  }
}

module.exports = LocalScanJober;
