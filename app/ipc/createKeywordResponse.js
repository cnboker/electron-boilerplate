module.exports = function(event, docs) {
  var doc = docs.shift();
  var promiseAll = []
  while (doc) {
    console.log("keyword_create", doc);
    var promise = scanJober.execute(doc);
    promiseAll.push(promise)
    doc = docs.shift();
  }
  return Promise.all(promiseAll)
});