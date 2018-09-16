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
            end:this.taskFinishedCallback
        }
        jobContext.addTask(task);
        // if(unScanItems.length > 0){
        //     notifier.notify({
        //         title: 'kwPolish提示信息',
        //         message: '优化引擎正在分析您关键字的原始排名,请耐心等待结果...'
        //       });
        //     //notifier.notify('优化引擎正在分析您关键字的原始排名,请耐心等待结果...');
        // }
        // this.itemsPush(unScanItems);
       // console.log('execute end...')
    }

    //程序启动检查是否还有未处理的关键字
    static async appStartRun(){
        var arr = await this._fetchData();
        console.log('arr', arr)
        if(arr.length == 0)return;
        
        arr.forEach(function(item){
            console.log('scan items', item)
            ScanJober.execute(item)
        })
    }

    static async taskFinishedCallback(doc){
        const access_token = auth.getToken().access_token;
        const url = `${process.env.REACT_APP_API_URL}/kwTask/rank`
        const res = axios({
            method:'post',
            url,
            data:doc,
            headers:{
                Authorization: `Bearer ${access_token}`
            }
        }).then(function(response){
            messager('pageRefresh')
           // console.log(response)
           logger.info('scan post', response.data)
        }).then(function(err){
           // console.error(err)
        })
    }

    static async  _fetchData() {
        try{
            const access_token = auth.getToken().access_token;
           //const access_token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJEZW1vX0lzc3VlciIsImF1ZCI6IkRlbW9fQXVkaWVuY2UiLCJleHAiOjE1NjEyNTQzNzYsInNjb3BlIjoiZnVsbF9hY2Nlc3MiLCJzdWIiOiJzY290dCIsImp0aSI6Ik10cW1XdlBCNXBzVXg5NXMiLCJhbGciOiJIUzI1NiIsImlhdCI6MTUzMDE1MDM3Nn0.Ue1pSRuWxE1ojrau9es23rMo7hSMTGlS87k-tflHOOg'
            const url = `${process.env.REACT_APP_API_URL}/keywords`
            logger.info('scanjob-_fetchData-url', url);
            const res = await axios({
                method:'get',
                url,
                headers:{
                    Authorization: `Bearer ${access_token}`
                }
            })
            const json =  res.data;
           // console.log(json)
            if(json == undefined)return [];
            return json.filter(function (item, index) {
                return item.originRank == 0;
            })
        }catch(e){
            console.log(e)
            return [];
        }
       
       
    }
}

module.exports = ScanJober;