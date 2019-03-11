'use strict';

const notifier = require('node-notifier');  
var jobContext = require('./jobContext');
var jobAction = require('./jobAction')
var axios = require('axios');

const auth = require('../auth')
var logger = require('../logger')
const messager = require('./ipcSender');


class ScanJober {
    constructor() {    
    }

    //每5分钟执行一次
    static async execute(doc) {
        var task = {
            doc,
            action: jobAction.SCAN,
            end:this.taskFinishedCallback,
            finished:false
        }
        jobContext.addTask(task);
       
        return new Promise(function (resolve, reject) {
            (function waitFor(){
                if (doc.finishedFlag) {
                    delete doc.finishedFlag;
                    return resolve(doc)
                };
                setTimeout(waitFor, 100);
            })();
        });
        // if(unScanItems.length > 0){
        //     notifier.notify({
        //         title: 'kwPolish提示信息',
        //         message: '优化引擎正在分析您关键词的原始排名,请耐心等待结果...'
        //       });
        //     //notifier.notify('优化引擎正在分析您关键词的原始排名,请耐心等待结果...');
        // }
        // this.itemsPush(unScanItems);
       // console.log('execute end...')
    }

    //程序启动检查是否还有未处理的关键词
    static async originRankCheck(){
        var arr = await this._fetchData();
        if(arr.length == 0)return;
        
        arr.forEach(function(item){
            ScanJober.execute(item)
        })
    }

    static async taskFinishedCallback(doc){
        const access_token = auth.getToken().access_token;
        const url = `${process.env.REACT_APP_API_URL}/kwTask/rank`
        axios({
            method:'post',
            url,
            data:doc,
            headers:{
                Authorization: `Bearer ${access_token}`
            }
        }).then(function(response){
            doc.finishedFlag = true;
            //messager("message", `${doc.keyword}排名检测完成`);
            //messager("pageRefresh");
        }).then(function(err){
           // console.error(err)
        })
    }

    static async  _fetchData() {
        try{
            const access_token = auth.getToken().access_token;
            const url = `${process.env.REACT_APP_API_URL}/unRankKeywords`
            //logger.info('scanjob-_fetchData-url', url);
            const res = await axios({
                method:'get',
                url,
                headers:{
                    Authorization: `Bearer ${access_token}`
                }
            })
            const json =  res.data;
            console.log('unrankkeywords',json)
           return json;
        }catch(e){
            console.log(e)
            return [];
        }
    }

}

module.exports = ScanJober;