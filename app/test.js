var moment = require('moment')
var random = require('./tasks/random')
var min = 0; //2min
var max = 5 * 60; // 10min


  var next = moment().add(random(min, max), "seconds");

  console.log(next.format("YYYY-MM-DD HH:mm:ss"));