  function extractHostname(url) {
  var hostname;
  //find & remove protocol (http, ftp, etc.) and get hostname

  if (url.indexOf("//") > -1) {
      hostname = url.split('/')[2];
  }
  else {
      hostname = url.split('/')[0];
  }

  //find & remove port number
  hostname = hostname.split(':')[0];
  //find & remove "?"
  hostname = hostname.split('?')[0];

  return hostname;
}

// To address those who want the "root domain," use this function:
 function extractRootDomain(url) {
  var domain = extractHostname(url),
      splitArr = domain.split('.'),
      arrLen = splitArr.length;

  //extracting the root domain here
  //if there is a subdomain 
  if (arrLen > 2) {
      domain = splitArr[arrLen - 2] + '.' + splitArr[arrLen - 1];
      //check to see if it's using a Country Code Top Level Domain (ccTLD) (i.e. ".me.uk")
      if (arrLen == 4 ) {
          //this is using a ccTLD
          domain = splitArr[arrLen - 3] + '.' + domain;
      }
  }
  return domain;
}

console.log(extractRootDomain('http://www.sohu.com.cn/baidu-aaa'))
//console.log(extractHostname('http://www.sohu.com.cn'))
console.log(extractRootDomain('http://www.sohu.com/2018-4-3'))