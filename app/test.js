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
  await job.inputKeyword(page, "软件定制");

  await job.goPage(page, 2);
  var rank = await job.pageRank(page, "ioliz.com", 1);
  if (rank > 0) {
    job.findLinkClick(page, "ioliz.com");
  
  }
}

