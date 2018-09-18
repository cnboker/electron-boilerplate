'use strict';

var axios = require('axios');
var jobContext = require('./jobContext');
var jobAction = require('./jobAction');
var logger = require('../logger')
const auth = require('../auth')
var schedule = require('node-schedule');
var store = require('./localStore')
var taskRouter = require('./taskRouter')
const messager = require('./ipcSender');

class PolishJober {
    static async execute() {
        var docs = store.getKeywordLocalStorage();
        if (docs.length == 0) {
            docs = await this._fetchData();
            logger.info('fetch tasks length', docs.length);
            store.setKeywordLocalStorage(docs);
        }
        this.itemsPush(docs);    
    }
    
    static singlePush(doc){
        doc.state = 'origin'
        var task = {
            doc,
            action: jobAction.Polish,
            end: this.taskFinishedCallback
        }
        jobContext.addTask(task);
        var date = new Date(doc.runTime);
        logger.info('polish', doc)
        schedule.scheduleJob(date, function (task) {
            logger.info('scheduleJob time=', Date.now().toString())
            const doc = task.doc;
            if (jobContext.busy) {                    
                return;
            }
            if (doc.state == 'dirty') {
                logger.info('doc dirty', doc)
                return;
            }
            console.log('schedule time polish', doc)
           
            taskRouter
                .execute(task)
                .then(() => {
                    messager('pageRefresh')
                    store.removeItem(doc._id);
                })
        }.bind(null, task));
    }
    
    static itemsPush(docs) {
        var doc = docs.shift();
        while (doc) {
            this.singlePush(doc);
            doc = docs.shift();
        }
    }

    //关键字已擦亮
    //doc:已经擦亮的关键字
    static async taskFinishedCallback(doc) {
        const access_token = auth.getToken().access_token;
        const url = `${process.env.REACT_APP_API_URL}/kwTask/polish`
        const res = axios({
            method: 'post',
            url,
            data: doc,
            headers: {
                Authorization: `Bearer ${access_token}`
            }
        }).then(function (response) {
            messager('pageRefresh')
            //console.log(response)
            logger.info('polish post', response.data)
        }).then(function (err) {
            logger.info(err)
        })
    }

    //获取待擦亮关键字列表
    static async _fetchData() {
        const access_token = auth.getToken().access_token;
        try {
            const url = `${process.env.REACT_APP_API_URL}/kwTask/tasks`;
            const res = await axios({
                method: 'get',
                url,
                headers: {
                    Authorization: `Bearer ${access_token}`
                }
            });
            return res.data;
        } catch (e) {
            return []
        }

    }

}

module.exports = PolishJober;