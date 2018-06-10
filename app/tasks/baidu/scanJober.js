'use strict';

const notifier = require('node-notifier');
var jobContext = require('./jobContext');
var jobAction = require('../jobAction')
var axios = require('axios');

const access_token = require('../../auth')
var logger = require('../../logger')

class ScanJober {
    constructor() {
     
    }

    //每5分钟执行一次
    static async execute(jobContext) {
        if(jobContext.hasScanTask())return;
        const unScanItems = await this._fetchData();
        logger.info('unScanItems',unScanItems.length);
        if(unScanItems.length > 0){
            notifier.notify({
                title: 'kwPolish提示信息',
                message: '优化引擎正在分析您关键字的原始排名,请耐心等待结果...'
              });
            //notifier.notify('优化引擎正在分析您关键字的原始排名,请耐心等待结果...');
        }
        var doc = unScanItems.shift();
        while (doc) {
            var task = {
                doc,
                action: jobAction.SCAN,
                end:this.taskFinishedCallback
            }
            jobContext.addTask(task);
            doc = unScanItems.shift();
        }

       // console.log('execute end...')
    }

    static async taskFinishedCallback(doc){
        const url = `${process.env.REACT_APP_API_URL}/kwTask/rank`
        const res = axios({
            method:'post',
            url,
            data:doc,
            headers:{
                Authorization: `Bearer ${access_token}`
            }
        }).then(function(response){
           // console.log(response)
        }).then(function(err){
            console.error(err)
        })
    }

    static async  _fetchData() {
        try{
            const url = `${process.env.REACT_APP_API_URL}/keywords`
            logger.info('scanjob-_fetchData-url', url);
            console.log(url);
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
            return [];
        }
       
       
    }
}

module.exports = ScanJober;