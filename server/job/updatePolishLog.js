/*
增加owner字段
*/
var mongoose = require("mongoose"); //.set('debug', true);
mongoose.Promise = require("bluebird");
mongoose.connect("mongodb://localhost/kwPolish");

var User = require("../api/User/Model");
var Keyword = require("../api/Keyword/Model");
var PolishLog = require("../api/Keyword/PolishLogModel");

Promise.all([
  Keyword.find({ originRank: { $gte: 0 }, dynamicRank: { $gte: 0 } }),
  PolishLog.find({ owner: { $exists: false } })
])
  .then(async ([keywords, logs]) => {
    var map = keywords.reduce((map, item) => {
      map[item._id] = item;
      return map;
    }, {});
    //for of support async but forEach not
    for (var doc of logs) {
      var kw = map[doc.keyword_id];

      if (kw) {
        doc.owner = kw.user;
        await doc.save();
      }else{
        await doc.remove();
      }
    }
  })
  .then(() => {
    console.log("disconnect");
    //mongoose.disconnect();
  });
