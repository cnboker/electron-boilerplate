process.env.NODE_ENV = 'test'
var scheduler = require('./scheduler')
var dbinit = require('../../../data/scripts/init');
//var ScanerJober = require('./baidu/scanJober');
var jobContext = require('./baidu/jobContext');

var path = require('path')
//console.log(path.resolve('./'))
require('dotenv').config({
  path: './.env'
});

// dbinit(() => {
//     scheduler.doTask();
//     //ScanerJober.execute(jobContext);
// })


(async function(){
  var sleep = require('./../utils/sleep')
  console.log('sleep 5s')
  await sleep(20000)
  console.log('sleep 5s end')
})();
