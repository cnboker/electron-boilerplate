var sleep = require("./sleep");
var scroll = require("./scroll");
var random = require("./random");
var jobAction = require("./jobAction");
var jobContext = require("./jobContext");
const messager = require("./ipcSender");
const auth = require("../auth");
var logger = require("../logger");
const SCAN_MAX_PAGE = 12;
const linkSelector = "#content_left div.f13";
const titleSelector = "#content_left div h3";

async function scanExecute(task) {
  var cheer = require("./cheerioPageTaskJob");
  var result = await cheer(jobContext.puppeteer, task.doc);
  task.doc.rank = result.pageIndex;
  task.doc.adIndexer = result.adIndexer;
  task.end(task.doc);
}

async function execute(task) {
  // if (task.action == jobAction.SCAN) {
  //   scanExecute(task);
  //   return;
  // }

  if (jobContext.busy || jobContext.puppeteer == undefined) return;
  jobContext.busy = true;
  task.doc.engine = "baidu";
  if (jobContext.browser) {
    jobContext.browser.close();
  }
  const browser = await jobContext.puppeteer.launch({
    headless: process.env.NODE_ENV == "production",
    //devtools:true,
    executablePath: (() => {
      return process.env.ChromePath;
    })()
  });
  jobContext.browser = browser;
  // const browser = await puppeteer.launch({     ignoreHTTPSErrors: true,
  // args: ['--proxy-server=example.com:8080'] }); const page = await
  // browser.newPage(); await page.setExtraHTTPHeaders({
  // 'Proxy-Authorization': 'Basic ' +
  // Buffer.from('user:pass').toString('base64'), });

  const page = await browser.newPage();
  //无痕窗口
  page.setExtraHTTPHeaders({ DNT: "1" });
  await page._client.send("Network.clearBrowserCookies");

  singleTaskProcess(page, task)
    .then(() => {
      task.end(task.doc);
      if (
        task.action == jobAction.Polish &&
        task.doc.user != auth.getToken().userName
      ) {
        if (task.doc.rank > 0) {
          var text = task.doc.title ? task.doc.title : task.doc.link;
          findLinkClick(page, text).then(() => {
            jobContext.busy = false;
          });
        } else {
          jobContext.busy = false;
        }
      } else {
        jobContext.busy = false;
      }
      messager("message", `新的关键词优化完成`);
    })
    .catch(e => {
      jobContext.busy = false;
      console.error(err);
      logger.info(err);
    });
}

async function urlNaviage(page, url) {
  await page.goto(url, { waitUtil: "load" });
  await sleep(2000);
}
//从第一页到第二页逐页扫描
async function singleTaskProcess(page, task) {
  if (task === undefined) return;

  var pageIndex = 0;
  var doc = task.doc;
  try {
    await inputKeyword(page, doc.keyword, task.action == jobAction.Polish);

    doc.adIndexer = await adIndexer(page);

    //首页处理
    var rank = await fullPageRank(page, doc, pageIndex);
    doc.rank = rank || -1;
    if (doc.rank > 0) {
      return;
    }

    //上一次扫描排行当前页，前后页处理
    if (task.action == jobAction.Polish) {
      await quickScanClick(page, task);
    } else {
      //重新扫描
      pageIndex = 0;
      //await inputKeyword(page, doc.keyword); 如果还找不到逐页扫描
      const nextpageSelector = '#page > a[href$="rsv_page=1"]';
      while (pageIndex < SCAN_MAX_PAGE) {
        if (pageIndex !== 0) {
          const rank = await fullPageRank(page, doc, pageIndex);
          doc.rank = rank || -1;
          if (doc.rank > 0) {
            break;
          }
        }
        scroll(page);
        page.click(nextpageSelector);

        if (task.action == jobAction.Polish) {
          await sleep(random(10000, 20000));
        } else {
          await sleep(random(3000, 10000));
        }
        pageIndex++;
      }
    }
  } catch (e) {
    logger.info(e);
    console.error(e);
  }
}

//根据初始排名前一页后一样扫描，如果未找到再进行逐页扫描
async function quickScanClick(page, task) {
  if (task == undefined) return;

  var doc = task.doc;
  try {
    doc.rank = doc.originRank;
    if (doc.dynamicRank < doc.rank) {
      doc.rank = doc.dynamicRank;
    }
    var pageIndex = Math.ceil(doc.rank / 10);
    console.log("pageIndex", pageIndex);
    quickSeachList = [pageIndex - 1, pageIndex, pageIndex + 1];
    console.log(quickSeachList);
    for (var i = 0; i < quickSeachList.length; i++) {
      pageIndex = quickSeachList[i];
      if (pageIndex <= 1 || pageIndex > SCAN_MAX_PAGE) continue;
      await goPage(page, pageIndex);
      doc.rank = await fullPageRank(page, task.doc, pageIndex - 1);
      if (doc.rank > 0) {
        console.log(`当前页${pageIndex}找到排名${doc.rank}`);
        break;
      }
    }

    if (doc.rank > 0) return;

    for (var i = 1; i < SCAN_MAX_PAGE; i++) {
      pageIndex = i;
      if (quickSeachList.includes(pageIndex) || pageIndex <= 1) continue;
      await goPage(page, pageIndex);
      doc.rank = await fullPageRank(page, task.doc, pageIndex - 1);
      if (doc.rank > 0) {
        console.log(`当前页${pageIndex}找到排名${doc.rank}`);
        break;
      }
    }
  } catch (e) {
    logger.info(e);
    console.error(e);
  }
}
async function goPage(page, pageIndex) {
  await page.evaluate(pageIndex => {
    var nodes = document.querySelectorAll("#page > a");
    var items = [...nodes].filter(x => {
      return x.innerText == pageIndex;
    });
    if (items.length > 0) {
      console.log("ok");
      items[0].click();
    }
  }, pageIndex);
  await sleep(random(2000, 5000));
  scroll(page);
}

//输入框模拟输入关键词
async function inputKeyword(page, input, anyclick) {
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

  //await page.keyboard.press('Enter')

  // let pages = await page.browser().pages();
  // var url = pages[pages.length - 1].url();
  // await page.goto(url+'&t=1233', {waitUtil: "load"});
  // await sleep(2000);
  // 首页任意点击 if (anyclick) {   await page.evaluate(() => {     var nodes =
  // document.querySelectorAll("div.result.c-container");     var arr =
  // [...nodes];     var index = Math.floor(Math.random() * arr.length) + 1;
  // if (index > 0) {       arr[index - 1].getElementsByTagName("a")[0].click();
  //   }   });   await sleep(10000);   let pages = await page.browser().pages();
  // pages[pages.length - 1].close(); }
}

//查找当前页是否包含特定关键词
async function pageHasKeyword(page, keyword) {
  const selector = "#content_left";
  //await page.waitForSelector(selector); #\31 > div.f13
  var text = await page.$eval(selector, div => {
    return div.innerText;
  });
  //console.log('div', text)
  return text.indexOf(keyword) > 0;
}

async function fullPageRank(page, doc, pageIndex) {
  var rank = await pageRank(page, linkSelector, doc.link, pageIndex);
  doc.rank = rank || -1;
  if (doc.rank > 0) {
    return rank;
  }
  //百家号title匹配
  if (doc.title) {
    rank = await pageRank(page, titleSelector, doc.title, pageIndex);
    doc.rank = rank || -1;
    if (doc.rank > 0) {
      return rank;
    }
  }

  return -1;
}

//检查当前页是否包含特定链接 match:特定链接，比如ioliz.com,pageIndex:分页 return -1 表示未找到匹配链接
async function pageRank(page, selector, match, pageIndex) {
  //const selector = "#content_left div.f13";
  var currentRank = await page.$$eval(
    selector,
    (links, match) => {
      return links.findIndex(function(element) {
        return element.innerText.indexOf(match) >= 0;
      });
    },
    match
  );
  var rank = -1;

  if (currentRank >= 0) {
    rank = pageIndex * 10 + currentRank + 1;
  }
  console.log(
    "currentRank=",
    currentRank,
    "pageIndex=",
    pageIndex + 1,
    "rank=",
    rank
  );
  return rank;
}

//查找包含关键词的链接，并同时点击该链接
async function findLinkClick(page, keyword) {
  // await page.evaluate(keyword => {   var nodes =
  // document.querySelectorAll("div.result.c-container");   var arr = [...nodes];
  //  var items = arr.filter(x => {     return x.innerText.indexOf(keyword) >= 0;
  //  });   if (items.length > 0) {     var index = arr.indexOf(items[0]);     if
  // (index > 0) {       arr[index - 1].getElementsByTagName("a")[0].click();
  // }   } }, keyword); await sleep(5000); let pages = await
  // page.browser().pages(); var firstPage = pages[pages.length - 1]; if
  // (firstPage.url().indexOf("baidu.com") == -1) {   firstPage.close(); }
  // page.bringToFront(); await sleep(2000);

  await page.evaluate(keyword => {
    var nodes = document.querySelectorAll("div.result.c-container");
    var arr = [...nodes];
    var items = arr.filter(x => {
      return x.innerText.indexOf(keyword) >= 0;
    });
    if (items.length > 0) {
      items[0].getElementsByTagName("a")[0].click();
    }
  }, keyword);
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

exports.execute = execute;
exports.pageRank = pageRank;
exports.singleTaskProcess = singleTaskProcess;
exports.findLinkClick = findLinkClick;
exports.inputKeyword = inputKeyword;
exports.goPage = goPage;
exports.adIndexer = adIndexer;
