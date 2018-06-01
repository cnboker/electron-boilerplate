process.env.NODE_ENV = 'test'
var path = require('path')
require('dotenv').config({
  path: './env'
})

let chai = require('chai');
let expect = chai.expect;
let should = chai.should;
var puppeteer = require('puppeteer')
let jobContext = require('../src/tasks/baidu/jobContext')
let pageTaskJob = require('../src/tasks/baidu/pageTaskJob')
const jobAction = require('../src/tasks/jobAction')
it('link return rank', (done) => {
  (async () => {
    const browser = await puppeteer.launch({
      headless: false,
      //executablePath:'./resources/app/node_modules/puppeteer/.local-chromium/win64-555668/chrome-win32/chrome.exe'
    })
    const page = await browser.newPage();

    const pageUrl = 'https://www.baidu.com/s?wd=%E8%BD%AF%E4%BB%B6%E5%AE%9A%E5%88%B6&pn=30&oq=%E8%BD%AF%E4%BB%B6%E5%AE%9A%E5%88%B6&ie=utf-8&rsv_idx=1&rsv_pq=a9611d420005e20b&rsv_t=42deGwuLscoWKO%2BiVcZVoBhFpfBll9XL53h%2Bix8GUJrHmcxKx2NBnb7RD5I';
    await page.goto(pageUrl, {
      waitUtil: 'load'
    });

    var rank = await pageTaskJob.pageRank(page, 'ioliz.com', 0);
    //expect(4).to.equal(rank);
    done();
    await browser.close();
  })();

});

it('execute single task return rank', (done) => {
  jobContext.tasks = [{
    doc: {
      userName: 'scott',
      engine: 'baidu',
      link: 'ioliz.com',
      keyword: '软件定制',
      rank: 0,
    },
    action: jobAction.SCAN,
    end: function (doc) {
      console.log('scanjober execute doc rank', doc.rank);
      expect(doc.rank).to.be.lt(40);
    },

  }];
  pageTaskJob.execute(jobContext).then(() => {
    console.log('execute single task return rank end...')
    done();
  })
});

