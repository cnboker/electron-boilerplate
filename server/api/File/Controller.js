"use strict";


exports.fileUpload = function (req, res) {
  const path = require('path')
  const file = req.file;
  let url = `${file
    .path
    .replace('public' + path.sep,   path.sep)}`;
  res.send({url})

  //end
}