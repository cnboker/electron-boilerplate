var Keyword = require("../api/Keyword/Model");


var mongoose = require("mongoose"); //.set('debug', true);
mongoose.Promise = require("bluebird");
mongoose.connect("mongodb://localhost/kwPolish");

Keyword.find(
  {
    user: "scott",
    originRank: {
      $gt: 0
    },
    isValid: true,
    status: 1,
    shield: {
      //过滤过期会员无效的关键字
      $ne: 1
    }
  },
  "_id user originRank dynamicRank keyword link polishedCount title createDate",
  {
    sort: {
      polishedCount: -1
    }
  }
)
.then(keywords => {
  console.log(keywords);
  mongoose.disconnect();
});
