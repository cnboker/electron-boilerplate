var PolishLog = require("../api/Keyword/PolishlogModel");
var User = require("../api/User/Model");

module.exports = function() {
  return new Promise((resolve, reject) => {
    PolishLog.aggregate([
      {
        $lookup: {
          from: "keyword",
          localField: "keyword_id",
          foreignField: "_id",
          as: "keyword"
        }
      },
      {
        $group: {
          _id: {
            user: "$user",
            keyword: "$keyword"
          },
          avg_dynamicRank: { $avg: "$dynamicRank" }
        }
      }
    ])
      .then(docs => {
        resolve(docs);
      })
      .catch(e => {
        reject(e);
      });
  });
};
