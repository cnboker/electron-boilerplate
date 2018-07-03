var moment = require('moment')
var random = require('../../utils/random')

module.exports = function (docs) {
  var next = moment().add(random(5, 20), 'minutes'); //hours,minutes,seconds
  var objs = [];
  for (let doc of docs) {
    
    //var obj = {...doc, time:next.format('YYYY-MM-DD HH:mm:ss')};
    const obj = Object.assign({}, doc.toObject(), {runTime:next.format('YYYY-MM-DD HH:mm:ss')})
    objs.push(obj)
    //doc.runTime = next.format('YYYY-MM-DD HH:mm:ss');
    next = next.add(random(5, 20), 'minutes');
    console.log(obj)
  }
  return objs;
}