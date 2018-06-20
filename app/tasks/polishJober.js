'use strict';

var axios = require('axios');
var jobContext = require('./jobContext');
var jobAction = require('./jobAction');
var logger = require('../logger')
const auth = require('../auth')


class PolishJober {

    static async execute(jobContext) {
        if (jobContext.hasPolishTask()) return;
        const docs = await this._fetchData();

        this.itemsPush(docs);
        logger.info('jobContext count', jobContext.tasks.length);
    }

    static itemsPush(docs) {
        var doc = docs.shift();
        while (doc) {
            var task = {
                doc,
                action: jobAction.Polish,
                end: this.taskFinishedCallback
            }
            jobContext.addTask(task);
            doc = docs.shift();
        }
    }
    //关键字已擦亮
    //doc:已经擦亮的关键字
    static async taskFinishedCallback(doc) {
        const access_token = auth.getToken();
        const url = `${process.env.REACT_APP_API_URL}/kwTask/polish`
        const res = axios({
            method: 'post',
            url,
            data: doc,
            headers: {
                Authorization: `Bearer ${access_token}`
            }
        }).then(function (response) {
            //console.log(response)
        }).then(function (err) {
            console.log(err)
        })
    }

    //获取待擦亮关键字列表
    static async _fetchData() {
        const access_token = auth.getToken();
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