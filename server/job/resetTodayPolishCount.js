var Keyword = require('../api/Keyword/Model')

module.exports = function () {
  console.log('reset log...')
  return new Promise((resolve, reject) => {
    Keyword.updateMany({}, {
      todayPolishedCount: 0
    }, {
      multi: true,
      upsert: true
    }).then(() => resolve()).catch(e => {
      reject(e)
    })
  })
}