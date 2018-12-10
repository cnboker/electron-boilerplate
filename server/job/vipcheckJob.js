var schedule = require("node-schedule");
var logger = require("../logger");
var User = require('../api/User/Model')
var Keyword = require('../api/Keyword/Model')
require('../utils/groupBy')
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

function doJob() {
  User
    .find({
    grade: 2,
    vipExpiredDate: {
      $lt: new Date()
    }
  })
    .then(users => {
      var usernames = users.map(x => {
        return x.userName
      });
      return usernames;
    })
    .then(names => {
      return Keyword.find({
        user: {
          $in: usernames
        }
      })
    })
    .then(keywords => {
      var userKeywords = keywords.groupby('user');
      var keys = Object.keys(userKeywords);
      for (var key of keys) {
        var uks = userKeywords[key];
        if (uks.length > 5) {
          var uksids = uks
            .splice(5)
            .map(x => {
              return x._id;
            })
          Keyword.updateMany({
            _id: {
              $in: uksids
            }
          }, {
            Shield: 1
          }, {multi: true})
        }
      }

    })
}

module.exports = doJob;
