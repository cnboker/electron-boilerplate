var moment = require("moment");
var random = require("./tasks/random");
var sleep = require("./tasks/sleep");
var min = 0; //2min
var max = 5 * 60; // 10min
var job = require("./tasks/pageTaskJob");
var word = require("./tasks/wordExtender");
run();

async function run() {
  // var arr = await word.search('油墨印刷')
  // console.log('list', arr)
  // const puppeteer = require("puppeteer");
  // const browser = await puppeteer.launch({
  //   headless: false
  //   // executablePath:'C:/Users/scott/AppData/Local/Programs/app/resources/node_modules/puppeteer/.local-chromium/win64-564778/chrome-win32/chrome.exe'
  // });

  // const page = await browser.newPage();
  // await page._client.send('Network.clearBrowserCookies');
 
  // //await page._client.send('Network.clearLocalStorage');

  // await job.inputKeyword(page, "充电桩监控软件 定制开发公司");
  const auth = require("./auth");
  var client = require("./tasks/socketClient");
  process.node_debug = true;
  client.main(auth.getToken())
}

