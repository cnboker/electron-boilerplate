require('./config')

var fs = require('fs');
var util = require('util');

if (!fs.existsSync(process.env.Home)) {
  fs.mkdirSync(process.env.Home)
}

var dir = `${process.env.Home}/logs`
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir)
}

var log_file = fs.createWriteStream(`${dir}/log.txt`, {
  flags: 'w'
});
var log_stdout = process.stdout;

var logger = {
  info: function (...args) { //
    var output = '';
    for(let arg of args){
      if(typeof arg === 'object'){
        output += ' ' + JSON.stringify(arg)
      }else{
        output += ' ' + arg;
      }
    }
    log_file.write(util.format(output) + '\r\n');
    log_stdout.write(util.format(output) + '\r\n');
  }
}

module.exports = logger