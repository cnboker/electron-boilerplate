var PolishLog = require("../api/Keyword/PolishlogModel");
var User = require("../api/User/Model");

module.exports = function () {
  return new Promise((resolve, reject) => {
    PolishLog.aggregate([

      {
        $group: {
          _id: {
            user: "$user",
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
          user: '$_id.user',
          keyword: '$keyword_docs.keyword',
          originRank: '$keyword_docs.originRank',
          dynamicRank: '$avg_dynamicRank',
          as: 'output'
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
          sum_originRank: {
            $avg: '$originRank'
          },
          sum_dynamicRank: {
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
            performanceIndex: (doc.sum_originRank - doc.sum_dynamicRank) / doc.sum_originRank
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
