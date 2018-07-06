var moment = require('moment')
var random = require('../../utils/random')
require('../../utils/groupBy')
var sortBy = require('../../utils/sort_by')

module.exports = function (docs) {
  var min = 5 * 60; //5min
  var max = 20 * 60; // 20min
  var next = moment().add(random(min, max), 'seconds'); //hours,minutes,seconds
  var objs = [];
  var sortDocs = sort(docs)
  for (let doc of sortDocs) {

    //var obj = {...doc, time:next.format('YYYY-MM-DD HH:mm:ss')};
    const obj = Object.assign({}, doc, {
      runTime: next.format('YYYY-MM-DD HH:mm:ss')
    })
    objs.push(obj)
    //doc.runTime = next.format('YYYY-MM-DD HH:mm:ss');
    next = next.add(random(min, max), 'seconds');
    //console.log(obj)
  }
  return objs;
}

function sort(docs) {
  var newDocs = [];
  console.info('doc type',  docs)
  var arr = docs.filter(function (doc) {
    return doc.originRank != -1
  })
  var gd = arr.groupBy('user');
  //console.log('-----------------',gd)
  var keys = Object.keys(gd)
  for (var key in gd) {
    gd[key] = gd[key].sort(sortBy('originRank', true));
  }

  while (Object.keys(gd).length > 0) {
    for (var key in gd) {
      var arr = gd[key]
      var val = arr.shift();
      if (val) {
        newDocs.push(val)
      }
      val =arr.shift();
      if (val) {
        newDocs.push(val)
      }
      if (arr.length == 0) {
        delete gd[key]
      }
    }
  }
  return newDocs;
}