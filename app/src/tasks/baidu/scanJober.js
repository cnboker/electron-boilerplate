var jobContext = require('./jobContext');
var jobAction = require('../jobAction')
var axios = require('axios');


const access_token = require('../../lib/auth')

class ScanJober {
    constructor() {
     
    }

    //每5分钟执行一次
    static async  execute(jobContext) {
        const unScanItems = await this._fetchData();
        console.log('unScanItems',unScanItems.length);
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

        console.log('execute end...')
    }

    static taskFinishedCallback(doc){
        const url = `${process.env.REACT_APP_API_URL}/keyword`
        const res = axios({
            method:'put',
            url,
            data:doc,
            headers:{
                Authorization: `Bearer ${access_token}`
            }
        }).then(function(response){
            console.log(response)
        }).then(function(err){
            console.error(err)
        })
    }

    static async  _fetchData() {
        const url = `${process.env.REACT_APP_API_URL}/keywords`
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
            return item.systemPage == 0;
        })
       
    }
}

module.exports = ScanJober;