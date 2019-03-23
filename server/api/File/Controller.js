"use strict";

var boom = require("boom");
var moment = require("moment");
var User = require("../User/Model");

exports.fileUpload = function (req, res) {

  const file = req.file;
  let url = `${file
    .path
    .replace('public/', '/')}`;
  res.send({url})

  //end
}