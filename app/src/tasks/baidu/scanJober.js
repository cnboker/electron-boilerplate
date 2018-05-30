var jobContext = require('./baidu/jobContext');
var jobAction = require('../jobAction')
const url = `${process.env.REACT_APP_API_URL}/keywords`

export default class ScanJober {
    constructor() {
        this.unScanItems = [];
      
    }

    //每5分钟执行一次
    async static execute(jobContext) {
        if (this.unScanItems.length == 0) {
            this._fetchData();
            return;
        }

        var doc = this.unScanItems.shift();
        while (doc) {
            var task = {
                doc,
                action: jobAction.SCAN,
                success: function (doc) {
                    //执行完成回调函数
                },
                failure:function(err){
                    console.log(err)
                }
            }
            jobContext.addTask(task);
            doc = this.unScanItems.shift();
        }

    }

    async static _fetchData() {
        var unScanItems = this.unScanItems;
        fetch(url, {
                method: 'get',
                headers: new Headers({
                    Authorization: `Bearer ${this.access_token}`
                })
            })
            .then(function (response) {
                return response.json();
            })
            .then(function (json) {
                json.filter(function (item, index) {
                    return item.systemPage == 0;
                }).forEach(function (element) {
                    unScanItems.push(element);
                })
            })
    }
}