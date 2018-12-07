'use strict';

var crypto = require('crypto')

//generates random string

var radmonString = function(length){
  return crypto.randomBytes(Math.ceil(length/2))
  .toString('hex')
  .slice(0,length);
}

var sha512 = function(password, salt){
  var hash = crypto.createHmac('sha512',salt);
  hash.update(password);
  var val = hash.digest('hex');
  return {
    salt:salt,
    passwordHash:val
  }
}

module.exports.hash = function(password){
  var salt = radmonString(16);
  return sha512(password,salt);
}

module.exports.radmon = radmonString;


