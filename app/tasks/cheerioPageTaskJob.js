const cheerio = require("cheerio");
const axios = require("axios");
var sleep = require("./sleep");

async function indexOf(urls, matchLink) {
  var contentsArray = [];

  var url = urls.shift();
  var pageIndex = -1;
  while (url) {
    console.info(url);
    var response = await axios.get(url);
    // Load the web page source code into a cheerio instance
    const $ = cheerio.load(response.data);
    const urlElems = $("div.result", "#content_left");
    //console.info(urlElems.text());
    // We now loop through all the elements found
    for (let i = 0; i < urlElems.length; i++) {
      const urlText = $(urlElems[i]).text();
      contentsArray.push(urlText);
    }
    var find = false;

    for (let i = 0; i < contentsArray.length; i++) {
      if (contentsArray[i].indexOf(matchLink) >= 0) {
        find = true;
        pageIndex = i + 1;
        break;
      }
    }

    if (find) break;

    sleep(1000);

    url = urls.shift();
  }
  return pageIndex;
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
  await sleep(2000);
}
/*
options = {
  keyword,
  link,
  linkTitle //企业完整title
}
*/
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
  result.pageIndex = await indexOf(urls, options.link);
  return result;
};

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
