var sleep = require("./sleep");
var scroll = require("./scroll");
var random = require("./random");
var jobAction = require("./jobAction");
var jobContext = require("./jobContext");
const messager = require("./ipcSender");

const SCAN_MAX_PAGE = 10;

async function execute(task) {
  if (jobContext.busy || jobContext.puppeteer == undefined) return;
  jobContext.busy = true;
  task.doc.engine = "baidu";
  const browser = await jobContext.puppeteer.launch({
    headless: process.env.NODE_ENV == "production",
    executablePath: (() => {
      return process.env.ChromePath;
    })()
  });

  // const browser = await puppeteer.launch({
  //     ignoreHTTPSErrors: true,
  //     args: ['--proxy-server=example.com:8080']
  // });
  // const page = await browser.newPage();
  // await page.setExtraHTTPHeaders({
  //     'Proxy-Authorization': 'Basic ' + Buffer.from('user:pass').toString('base64'),
  // });

  const page = await browser.newPage();
  await singleTaskProcess(page, task)
    .then(() => {
      task.end(task.doc);
      messager("message", `新的关键字优化完成`);
      jobContext.busy = false;
      browser.close();
    })
    .catch(err => {
      jobContext.busy = false;
      browser.close();
      console.error(err);
    });
}

//从第一页到第二页逐页扫描
async function singleTaskProcess(page, task) {
  if (task === undefined) return;

  var pageIndex = 0;
  var doc = task.doc;
  try {
    await inputKeyword(page, doc.keyword);

    await sleep(2000);
    console.log("sleep");
    //首页处理
    const rank = await pageRank(page, doc.link, pageIndex);
    doc.rank = rank || -1;
    console.log("首页处理");
    if (doc.rank > 0) {
      if (task.action == jobAction.Polish) {
        await findLinkClick(page, doc.link);
        await sleep(random(3000, 10000));
      }
      return;
    }

    //上一次扫描排行当前页，前后页处理
    await pageSkipScanClick(page, task);
    if (task.doc.rank > 0) return;

    //如果还找不到逐页扫描
    const nextpageSelector = '#page > a[href$="rsv_page=1"]';
    while (pageIndex < SCAN_MAX_PAGE) {
      if (pageIndex !== 0) {
        const rank = await pageRank(page, doc.link, pageIndex);
        doc.rank = rank || -1;
        if (doc.rank > 0) {
          if (task.action == jobAction.Polish) {
            await findLinkClick(page, doc.link);
            await sleep(random(3000, 10000));
          }
          break;
        }
      }

      scroll(page);
      page.click(nextpageSelector);
      //await page.evaluate((selector)=>document.querySelector(selector).click(),nextpageSelector)
      //wait load new page
      // await page.waitForNavigation({
      //   waitUntil: "load"
      // });
      if (task.action == jobAction.Polish) {
        await sleep(random(5000, 10000));
      } else {
        await sleep(random(3000, 10000));
      }
      pageIndex++;
    }
  } catch (e) {
    console.error(e);
  }
}

//根据初始排名前一页后一样扫描，如果未找到再进行逐页扫描
async function pageSkipScanClick(page, task) {
  if (task == undefined) return;
  if (task.action == jobAction.SCAN) return;
  var doc = task.doc;
  try {
    var rank = doc.dynamicRank || doc.originRank;
    console.log("rank=", rank);
    var pageIndex = Math.ceil(rank / 10);
    var nextPageIndex = pageIndex + 1;
    var lastPageSelector = `#page > a:nth-child(1)`; //上一页按钮

    var rank = -1;
    if (nextPageIndex < 10) {
      const nextpageSelector = `#page > a:nth-child(${nextPageIndex})`;
      console.log("nextpageSelector=", nextpageSelector);
      await pageClick(page, task, nextpageSelector, nextPageIndex);
      if (doc.rank > 0) {
        rank = doc.rank;
        console.log(`下一页${nextPageIndex}找到排名${doc.rank}`);
      }
    }

    if (pageIndex > 0) {
      console.log("lastPageSelector=", lastPageSelector);
      await pageClick(page, task, lastPageSelector, nextPageIndex - 1);
      if (doc.rank > 0) {
        rank = doc.rank;
        console.log(`当前页${nextPageIndex - 1}找到排名${doc.rank}`);
      }
    }

    if (pageIndex > 1) {
      await pageClick(page, task, lastPageSelector, nextPageIndex - 2);
      if (doc.rank > 0) {
        rank = doc.rank;
        console.log(`前一页${nextPageIndex - 2}找到排名${doc.rank}`);
      }
    }
    doc.rank = rank;
  } catch (e) {
    console.error(e);
  }
}

//打开特定分页
async function pageClick(page, task, selector, pageIndex) {
  try{
    var doc = task.doc;

    await page.evaluate(s => document.querySelector(s).click(), selector);
    // await page.waitForNavigation({
    //   waitUntil: "load"
    // });
    await sleep(random(2000, 5000));
    scroll(page);
  
    const rank = await pageRank(page, doc.link, pageIndex - 1);
    doc.rank = rank || -1;
    console.log("doc.rank=", doc.rank);
    if (doc.rank > 0) {
      if (task.action == jobAction.Polish) {
        findLinkClick(page, doc.link);
        await sleep(random(3000, 10000));
      }
    }
  }catch(e){
    console.log(selector,e)
  }
  
}

//输入框模拟输入关键字
async function inputKeyword(page, input) {
  const pageUrl = "http://www.baidu.com";
  page.setViewport({ width: 960, height: 768 });
  await page.goto(pageUrl, {
    waitUtil: "load"
  });
  await page.waitForSelector("#kw", { visible: true });
  await page.focus("#kw");
  //await page.waitFor("#kw");

  await page.$eval("#kw", (el, input) => (el.value = input), input);
  //await page.type("#kw",input)
  await page.waitFor(2000);

  //await page.click("#su");
  await page.evaluate(() => document.querySelector("#su").click());
  console.log("clicked");
}

//查找当前页是否包含特定关键字
async function pageHasKeyword(page, keyword) {
  const selector = "#content_left";
  //await page.waitForSelector(selector);
  //#\31 > div.f13
  var text = await page.$eval(selector, div => {
    return div.innerText;
  });
  //console.log('div', text)
  return text.indexOf(keyword) > 0;
}

//检查当前页是否包含特定链接
//match:特定链接，比如ioliz.com,pageIndex:分页
//return -1 表示未找到匹配链接
async function pageRank(page, match, pageIndex) {
  const selector = "#content_left div.f13";
  var currentRank = await page.$$eval(
    selector,
    (links, match) => {
      return links.findIndex(function(element) {
        return element.innerText.indexOf(match) >= 0;
      });
    },
    match
  );
  console.log("currentRank=", currentRank, "pageIndex=", pageIndex);
  if (currentRank >= 0) return pageIndex * 10 + currentRank + 1;
  return -1;
}

//查找包含关键字的链接，并同时点击该链接
async function findLinkClick(page, keyword) {
  // var selector = '//a[contains(text(), "' + keyword + '")]';
  // await page.evaluate((s)=>document.querySelector(s).click(),selector);

  // const linkHandler = (await page.$x(selector))[0];
  // if (linkHandler) {
  //   await linkHandler.click();

  // } else {
  //   throw new Error(`Link not found`);
  // }
  await page.evaluate(keyword => {
    var nodes = document.querySelectorAll("div.result.c-container");
    var items = [...nodes].filter(x => {
      return x.innerText.indexOf(keyword) >= 0;
    });
    if (items.length > 0) {
      items[0].getElementsByTagName("a")[0].click();
    }
  }, keyword);
}

exports.execute = execute;
exports.pageRank = pageRank;
exports.singleTaskProcess = singleTaskProcess;