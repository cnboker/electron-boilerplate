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
  Keyword.find({ originRank: { $gte: 0 }, dynamicRank: { $gte: 0 } }).limit(5),
  PolishLog.find({ owner: { $exists: false } }).limit(50000)
])
  .then(([keywords, logs]) => {
    var map = keywords.reduce((map, item) => {
      map[item._id] = item;
      return map;
    }, {});
 
    logs.forEach((doc, index) => {
      var kw = map[doc.keyword_id];
     
      if(kw){
        console.log('doc',doc)
        doc.owner = kw.user;
        //doc.set();
        
        doc.save(doc=>{
            console.log(doc)
        })
      }
    });

   
  })
  .then(() => {
    mongoose.disconnect();
  });
