var monent = require('moment')

module.exports.getOrderNo = function(){
  return monent().format('yyMMddHHmmss')
}

