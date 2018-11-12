var scanJober = require("./scanJober");
const messager = require("./ipcSender");
const worder = require("./wordExtender");
const logger = require("../logger");
module.exports = function(ipc) {
  ipc.on("keyword_create", function(event, docs) {
    var doc = docs.shift();
    if (doc) {
      console.log("keyword_create", doc);
      messager("message", `关键词"${doc.keyword}"等待优化`);
    }
    while (doc) {
      scanJober.execute(doc);
      doc = docs.shift();
    }
  });
  //拓词
  ipc.on("wordQuery", async function(event, keyword) {
    logger.info("wordQuery", keyword);
    var result = getByCache(keyword);
    if (result.length == 0) {
      result = await worder.search(keyword);
      logger.info("wordQuery result", keyword);
      setCache(keyword, result);
    }
    messager("wordResponse", { keyword, result });

  });
};

const KEYWORD_KEY = "WORDEXTENDER";
var kwData = global.nodeStorage.getItem(KEYWORD_KEY) || {};

function getByCache(keyword) {
  return kwData[keyword] || [];
}

function setCache(keyword, arr) {
  kwData[keyword] = arr;
  global.nodeStorage.setItem(KEYWORD_KEY, kwData);
}
