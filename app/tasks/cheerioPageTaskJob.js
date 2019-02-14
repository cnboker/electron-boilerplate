const cheerio = require("cheerio");
const axios = require("axios");
var sleep = require("./sleep");
var logger = require("../logger");
var Fuse = require('fuse.js')


async function indexOf(urls, matchLink) {
  var contentsArray = [];

  var url = urls.shift();
  var pageIndex = -1;
  while (url) {
    var response = await axios.get(url);
    // Load the web page source code into a cheerio instance
    const $ = cheerio.load(response.data);
    
    const urlElems = $("div.result", "#content_left");
   
    for (let i = 0; i < urlElems.length; i++) {
      var title = $(urlElems[i]).find('h3').text();
      var content = $(urlElems[i]).text();
      
      contentsArray.push({
        title,
        content
      });
    }
    var find = false;

    for (let i = 0; i < contentsArray.length; i++) {
      if (contentsArray[i].content.indexOf(matchLink) >= 0) {
        find = true;
        pageIndex = i + 1;
        break;
      }
    }

    if (find) break;

    await sleep(1000);

    url = urls.shift();
  }

  return {list:contentsArray,pageIndex};
}
//返回pageUrls

async function pageUrls(page, keyword) {
  var urls = [];

  await inputKeyword(page, keyword);
  urls.push(page.url().replace("https://", "http://"));
  ahrefs = await page.evaluate(() => {
    var nodes = document.querySelectorAll("#page > a");
    return [...nodes].map(x => {
      return x.href.replace("https://", "http://");
    });
  });
  urls.push(...ahrefs);

  return urls;
}

async function inputKeyword(page, input) {
  const pageUrl = "https://www.baidu.com";

  //page.setViewport({width: 960, height: 768});
  await page.goto(pageUrl, { waitUtil: "load" });

  await page.waitForSelector("#kw", { visible: true });
  await page.focus("#kw");
  //await page.waitFor("#kw");
  await page.$eval("#kw", (el, input) => (el.value = input), input);

  await sleep(2000);

  await page.evaluate(() => {
    document.querySelector("#su").click();
  });
  //
  await sleep(1000);
}
/*
options = {
  keyword,
  link,
  linkTitle //企业完整title
}
*/

var linksTitle = {};
module.exports = async function(puppeteer, options) {
  console.info( process.env.ChromePath)
  var browser = await puppeteer.launch({
    headless: process.env.NODE_ENV == "production",
    //devtools:true,
    executablePath: (() => {
      return process.env.ChromePath;
    })()
  });
  const page = await browser.newPage();
  urls = await pageUrls(page, options.keyword);
  var result = {
    adIndex: 0,
    pageIndex: -1
  };
  result.adIndexer = await adIndexer(page);

  browser.close();

  var indexResult = await indexOf(urls, options.link);
  result.pageIndex = indexResult.pageIndex;
  if(indexResult.pageIndex == -1){
    var link = 'http://www.' + options.link;
    var title = linksTitle[link]
    if(!title){
      var response = await axios.get(link);
      // Load the web page source code into a cheerio instance
      const $ = cheerio.load(response.data);
      linksTitle[link] = title = $('title').text();
      console.info('first title', linksTitle[link], title)
    }
   
    logger.info('title',title)
    result.pageIndex = fuzzy(title,indexResult.list)
    if(result.pageIndex > 0){
      result.title = indexResult.list[result.pageIndex-1].title;
    }
  }
  return result;
};

function fuzzy(title, stringArray) {
  var index = 1;
  var list = stringArray.map(x => {
    return {
      title: x.title,
      index: index++
    };
  });
  var options = {
    shouldSort: true,
    tokenize: true,
    threshold: 0.1,
    location: 0,
    distance: 0,
    maxPatternLength: 64,
    minMatchCharLength: 1,
    keys: ["title"]
  };
  var fuse = new Fuse(list, options); // "list" is the item array
  title = title.length > 30?title.substring(0,30):title;
  var result = fuse.search(title);
  logger.info(result)
  var pageIndex = -1;
  if (result.length > 0) {
    pageIndex = result[0].index;
  }
  return pageIndex;
}

async function adIndexer(page) {
  var adCount = await page.evaluate(() => {
    var nodes = document.querySelectorAll("#content_left>div>div");
    var arr = [...nodes];
    arr = arr.filter(e => {
      return e.getAttribute("cmatchid") != undefined;
    });
    return arr.length;
  });
  return adCount;
}
