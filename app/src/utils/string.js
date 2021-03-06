import moment from 'moment'
export function extractHostname(url) {
  var hostname;
  //find & remove protocol (http, ftp, etc.) and get hostname

  if (url.indexOf("//") > -1) {
    hostname = url.split("/")[2];
  } else {
    hostname = url.split("/")[0];
  }

  //find & remove port number
  hostname = hostname.split(":")[0];
  //find & remove "?"
  hostname = hostname.split("?")[0];

  return hostname;
}

// To address those who want the "root domain," use this function:
export function extractRootDomain(url) {
  var domain = extractHostname(url),
    splitArr = domain.split("."),
    arrLen = splitArr.length;

  //extracting the root domain here
  //if there is a subdomain
  if (arrLen > 2) {
    domain = splitArr[arrLen - 2] + "." + splitArr[arrLen - 1];
    //check to see if it's using a Country Code Top Level Domain (ccTLD) (i.e. ".me.uk")
    if(arrLen == 3 && splitArr[arrLen - 3] != 'www'){
      domain = splitArr[arrLen - 3] + "." + domain;
    }
    else if (arrLen == 4) {
      //this is using a ccTLD
      domain = splitArr[arrLen - 3] + "." + domain;
    }
  }
  return domain;
}

if (!String.prototype.trim) {
  (function() {
    // Make sure we trim BOM and NBSP
    var rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;
    String.prototype.trim = function() {
      return this.replace(rtrim, "");
    };
  })();
}

export function shortAuthor(user) {
  return (user.length > 4 ? user.substring(author.length - 4) : user) + "***";
}

export function customSplit(value) {
  var separators = ["\n"];
  var tokens = value.split(new RegExp(separators.join("|"), "g"));
  tokens = tokens.filter(function(val) {
    return val.trim().length > 1;
  });
  return tokens;
}

/*
var a = moment('2016-06-06T21:03:55');//now
var b = moment('2016-05-06T20:03:55');

console.log(a.diff(b, 'minutes')) // 44700
console.log(a.diff(b, 'hours')) // 745
console.log(a.diff(b, 'days')) // 31
console.log(a.diff(b, 'weeks')) // 4
*/
export function timeDuration(startTime,endTime){
  if(startTime === '' || !startTime)return '';
  if(endTime === '' || !endTime)return '';
  return moment.utc(moment(endTime).diff(moment(startTime))).format('HH:mm:ss')
}