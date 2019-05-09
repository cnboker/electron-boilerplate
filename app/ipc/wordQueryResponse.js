const worder = require("../tasks/wordExtender360");
const logger = require("../logger");

const KEYWORD_KEY = "WORDEXTENDER";
var kwData = global
  .nodeStorage
  .getItem(KEYWORD_KEY) || {};

function getByCache(keyword) {
  return kwData[keyword] || [];
}

function setCache(keyword, arr) {
  kwData[keyword] = arr;
  global
    .nodeStorage
    .setItem(KEYWORD_KEY, kwData);
}

module.exports = async function (event,keyword) {
  //拓词
  logger.info("wordQuery", keyword);
  var result = getByCache(keyword);
  if (result.length == 0) {
    result = await worder.search(keyword);
    logger.info("wordQuery result", keyword);
    setCache(keyword, result);
  }
  return result;
};