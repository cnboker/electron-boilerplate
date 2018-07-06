
require('./config')

var fs = require('fs');
var util = require('util');
var dir = `${process.env.AppRoot}/logs`
if(!fs.existsSync(dir)){
  fs.mkdirSync(dir)
}
var log_file = fs.createWriteStream(`${dir}/log.txt`, {
  flags: 'w'
});
var log_stdout = process.stdout;

var logger = {
  info: function (d) { //
    log_file.write(util.format(d) + '\n');
    log_stdout.write(util.format(d) + '\n');
  }
}

module.exports = logger