require('../config')

var scheduler = require('./scheduler')
// var dbinit = require('../../../data/scripts/init');
//var ScanerJober = require('./baidu/scanJober');
var jobContext = require('./jobContext');

var path = require('path')

// dbinit(() => {
//     scheduler.doTask();
//     //ScanerJober.execute(jobContext);
// })

scheduler.doTask();
