var moment = require('moment')
const KEYWORD_KEY = 'kwPoslish_tasks'

var setKeywordLocalStorage = function (arr) {
  
  var data = {
    date: moment().format('YYYY-MM-DD'),
    arr
  }
  global.nodeStorage.setItem(KEYWORD_KEY, JSON.stringify(data));
}

var getKeywordLocalStorage = function () {
  var json =  global.nodeStorage.getItem(KEYWORD_KEY);
  //var json = localStorage.getItem(KEYWORD_KEY);
  if (json == null) return [];
  var data = JSON.parse(json);
  if (data.date != moment().format('YYYY-MM-DD')) return [];
  return data.arr;
}

function remove(id) {
  var arr = getKeywordLocalStorage();
  arr = arr.filter(function (item) {
    return item._id != id
  });
  setKeywordLocalStorage(arr);
}

module.exports = {
  setKeywordLocalStorage,
  getKeywordLocalStorage
}