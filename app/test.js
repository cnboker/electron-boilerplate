var moment = require("moment");
var random = require("./tasks/random");
var sleep = require("./tasks/sleep");
var min = 0; //2min
var max = 5 * 60; // 10min
var job = require("./tasks/pageTaskJob");
run();

async function run() {
  const puppeteer = require("puppeteer");
  const browser = await puppeteer.launch({
    headless: false
    // executablePath:'C:/Users/scott/AppData/Local/Programs/app/resources/node_modules/puppeteer/.local-chromium/win64-564778/chrome-win32/chrome.exe'
  });

  const page = await browser.newPage();
  await page._client.send('Network.clearBrowserCookies');
 
  //await page._client.send('Network.clearLocalStorage');

  await job.inputKeyword(page, "充电桩监控软件 定制开发公司");
  // const header = await page.$('#su');
  // const rect = await page.evaluate((header) => {
  //   const {top, left, bottom, right} = header.getBoundingClientRect();
  //   return {top, left, bottom, right};
  // }, header);
  // console.log(rect);
  // //await page.mouse.move(12, 564);
  // await page.mouse.click(12, 564);

  // await page.evaluate(() => {
  //   window.location.reload();
  //   localStorage.clear();
  //   deleteAllCookies();
  //   function deleteAllCookies() {
  //     var cookies = document.cookie.split(";");
  
  //     for (var i = 0; i < cookies.length; i++) {
  //         var cookie = cookies[i];
  //         var eqPos = cookie.indexOf("=");
  //         var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
  //         document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
  //     }
  //   }
  // });
  //await page._client.send('Network.clearBrowserCookies');

  // await job.goPage(page, 2);
  // var rank = await job.pageRank(page, "ioliz.com", 1);
  // if (rank > 0) {
  //   job.findLinkClick(page, "ioliz.com");
  
  // }
}

