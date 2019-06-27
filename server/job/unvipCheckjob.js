var logger = require("../logger");
var User = require("../api/User/Model");
var Keyword = require("../api/Keyword/Model");
var moment = require("moment");
require("../utils/groupBy");
/*
*    *    *    *    *    *
┬    ┬    ┬    ┬    ┬    ┬
│    │    │    │    │    |
│    │    │    │    │    └ day of week (0 - 7) (0 or 7 is Sun)
│    │    │    │    └───── month (1 - 12)
│    │    │    └────────── day of month (1 - 31)
│    │    └─────────────── hour (0 - 23)
│    └──────────────────── minute (0 - 59)
└───────────────────────── second (0 - 59, OPTIONAL)
*/

module.exports =  function () {
 
  return new Promise((resolve, reject) => {
    User
      .find({
      grade: 1
    })
      .then(users => {
        return users.map(x => {
          return x.userName;
        });
      })
      .then(names => {
        console.info("users:" + names);
        return Keyword.find({
          user: {
            $in: names
          }
        });
      })
      .then(keywords => {
        var userKeywords = keywords.groupBy("user");
        var keys = Object.keys(userKeywords);
        var updateIds = [];
        for (var key of keys) {
          var uks = userKeywords[key];
          if (uks.length > 5) {
            var uksids = uks
              .splice(5)
              .map(x => {
                return x._id;
              });
            console.info("uids:" + key, uksids.join(","));
            updateIds.push(...uksids);
          }
        }
        return updateIds;
      })
      .then(ids => {
        return Keyword.updateMany({
          _id: {
            $in: ids
          }
        }, {
          shield: 1
        }, {
          multi: true,
          upsert: true
        });
      })
      .then(() => {
        resolve();
      })
      .catch(e => {
        reject(e)
      })
  })

}
