var PolishLog = require("../api/Keyword/PolishlogModel");
var User = require("../api/User/Model");

module.exports = function () {
  

  return new Promise((resolve, reject) => {
    PolishLog.aggregate([
      {
        $lookup: {
          from: 'keywords',
          localField: 'keyword_id',
          foreignField: '_id',
          as : 'keyword_docs'
        }
      }, {
        $unwind: '$keyword_docs'
      }, {
        $project: {
          user: '$user',
          keyword: '$keyword',
          originRank: '$keyword_docs.originRank',
          dynamicRank: '$dynamicRank'
        }
      }, {
        $match: {
          $and: [
            {
              originRank: {
                $nin: [0, -1, undefined]
              }
            }, {
              dynamicRank: {
                $ne: -1
              }
            }
          ]
        }
      }, 
       {
        $group: {
          _id: {user:'$user',keyword:'$keyword',originRank:'$originRank'},
          avg_dynamicRank: {
            $avg: '$dynamicRank'
          }
        }
      },
    ]).then(docs => {
      for (var doc of docs) {
        
        User.findOneAndUpdate({
          userName: doc._id.user
        }, {
          $set: {
            performanceIndex: (doc._id.originRank - doc.avg_dynamicRank) * 100 / doc._id.originRank
          }
        }, {
          //同时设置这2个参数，否则doc返回null
          upsert: true,
          new: true //return the modified document rather than the original. defaults to false
        }).then(doc => {
          resolve(doc);
        })
      }

    }).catch(e => {
      reject(e);
    });
  });
};
