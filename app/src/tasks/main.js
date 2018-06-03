process.env.NODE_ENV = 'test'
var scheduler = require('./scheduler')
var dbinit = require('../../../data/scripts/init');
var ScanerJober = require('./baidu/scanJober');
var jobContext = require('./baidu/jobContext');

var path = require('path')
//console.log(path.resolve('./'))
require('dotenv').config({
  path: './.env'
});

dbinit(() => {
    scheduler.doTask();
    //ScanerJober.execute(jobContext);
})