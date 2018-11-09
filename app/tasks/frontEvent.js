var scanJober = require("./scanJober");
const messager = require("./ipcSender");
const worder = require('./wordExtender')

module.exports = function(ipc) {
  ipc.on("keyword_create", function(event, docs) {
    var doc = docs.shift();
    if (doc) {
      console.log("keyword_create", doc);
      messager("message", `关键字"${doc.keyword}"等待优化`);
    }
    while (doc) {
      scanJober.execute(doc);
      doc = docs.shift();
    }
  });
  //拓词
  ipc.on("wordQuery", async function(event, keyword) {
    console.log('event', event, keyword)
    var result = await worder.search(keyword)
    messager("wordResponse", {keyword,result});
  });

};
