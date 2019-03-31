var Keyword = require("../api/Keyword/Model");
var User = require("../api/User/Model");

module.exports = function() {
  console.log("reset log...");
  return new Promise((resolve, reject) => {
    Promise.all([
      Keyword.updateMany(
        {},
        {
          todayPolishedCount: 0
        },
        {
          multi: true,
          upsert: true
        }
      ),
      User.updateMany(
        {},
        {
          todayPolishedCount: 0
        },
        {
          multi: true,
          upsert: true
        }
      )
    ])
      .then((a, b) => {
        resolve();
      })
      .catch(e => {
        reject(e);
      });
  });
};
