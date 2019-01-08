var PolishLog = require("../api/Keyword/PolishlogModel");
var User = require("../api/User/Model");

module.exports = function () {
  return new Promise((resolve, reject) => {
    PolishLog.aggregate([
      {
        $group: {
          _id: {
            keyword_id: "$keyword_id"
          },
          avg_dynamicRank: {
            $avg: "$dynamicRank"
          }
        }
      }, {
        $lookup: {
          from: "keywords",
          localField: "_id.keyword_id",
          foreignField: "_id",
          as: "keyword_docs"
        }
      }, {
        $unwind: '$keyword_docs'
      }, {
        $project: {
          user: '$keyword_docs.user',
          keyword: '$keyword_docs.keyword',
          originRank: '$keyword_docs.originRank',
          dynamicRank: '$avg_dynamicRank'
        }
      }, {
        $match: {
          originRank: {
            $ne: 0
          },
          dynamicRank: {
            $ne: -1
          }
        }
      }, {
        $group: {
          _id: '$user',
          avg_originRank: {
            $avg: '$originRank'
          },
          avg_dynamicRank: {
            $avg: '$dynamicRank'
          }
        }
      },
      // {$limit:50}
    ]).then(docs => {
      for (var doc of docs) {
        User.findOneAndUpdate({
          userName: doc._id
        }, {
          $set: {
            performanceIndex: (doc.avg_originRank - doc.avg_dynamicRank) * 100 / doc.avg_originRank 
          }
        }, {
          //同时设置这2个参数，否则doc返回null
          upsert: true,
          new: true //return the modified document rather than the original. defaults to false
        }).then(doc=>{
          resolve(doc);
        })
      }
      
    }).catch(e => {
      reject(e);
    });
  });
};
