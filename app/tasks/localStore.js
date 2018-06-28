var moment = require('moment')
const KEYWORD_KEY = 'kwPoslish_tasks'

var setKeywordLocalStorage = function (arr) {
  if (process.env.APP == 'node') {
    return;
  }
  var data = {
    date: moment().format('YYYY-MM-DD'),
    arr
  }
  localStorage.setItem(KEYWORD_KEY, JSON.stringify(data));
}

var getKeywordLocalStorage = function () {
  if (process.env.APP == 'node') {
    return null;
  }
  var json = localStorage.getItem(KEYWORD_KEY);
  if (json == null) return null;
  var data = JSON.parse(json);
  if (data.date != moment().format('YYYY-MM-DD')) return null;
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