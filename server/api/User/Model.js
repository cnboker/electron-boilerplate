'use strict';

var mongoose = require('mongoose');
var Scheam = mongoose.Schema;

var userSckema =new Scheam({
  userName:String, //username
  password:String, //password
  email:String,
  ip:String, //ip
  locked:Boolean, //is locked,
  createDate:Date,
  actived:Boolean
});

module.exports = mongoose.model('User', userSckema);