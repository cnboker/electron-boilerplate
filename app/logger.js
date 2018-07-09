require('./config')

var fs = require('fs');
var util = require('util');
var path = require('path');
var os = require('os'),
  EOL = os.EOL;

var dir = path.join(process.env.AppHome, 'logs');
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir)
}

var log_file = fs.createWriteStream(path.join(dir, 'log.txt'), {
  flags: 'w',
  encoding: 'utf8'
});
var log_stdout = process.stdout;

var logger = {
  info: function (...args) { //
    var output = '';
    for (let arg of args) {
      if (typeof arg === 'object') {
        output += ' ' + JSON.stringify(arg)
      } else {
        output += ' ' + arg;
      }
    }
    //https://shapeshed.com/writing-cross-platform-node/
    //Cross Platform Newline Characters
    log_file.write(util.format(output) + EOL);
    log_stdout.write(util.format(output) + EOL);
  }
}

module.exports = logger