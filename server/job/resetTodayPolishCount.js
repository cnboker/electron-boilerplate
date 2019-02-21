var Keyword = require("../api/Keyword/Model");

module.exports = function() {
  console.log("reset log...");
  return Promise.all([
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
};
