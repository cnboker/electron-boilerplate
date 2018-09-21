process.env.NODE_ENV = 'test'
var path = require('path')
require('dotenv').config({
  path: './env'
})

let chai = require('chai');
let expect = chai.expect;
let should = chai.should;
var puppeteer = require('puppeteer')
let jobContext = require('../tasks/jobContext')
let pageTaskJob = require('../tasks/pageTaskJob')
const jobAction = require('../tasks/jobAction')

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

it('pageSkipScanClick test',(done)=>{
  (async () => {
    const browser = await puppeteer.launch({
      headless: false,
      //executablePath:'./resources/app/node_modules/puppeteer/.local-chromium/win64-555668/chrome-win32/chrome.exe'
    })
    const page = await browser.newPage();

    const pageUrl = 'https://www.baidu.com/s?ie=utf-8&f=8&rsv_bp=1&rsv_idx=1&tn=baidu&wd=%E6%95%B0%E5%AD%97%E6%A0%87%E7%89%8C%20%E5%8F%91%E5%B8%83%E7%B3%BB%E7%BB%9F%20%E5%AE%9A%E5%88%B6%E5%BC%80%E5%8F%91&oq=%25E5%2585%2585%25E7%2594%25B5%25E6%25A1%25A9%25E7%259B%2591%25E6%258E%25A7%25E7%25B3%25BB%25E7%25BB%259F%2520%25E8%25BD%25AF%25E4%25BB%25B6%25E5%25AE%259A%25E5%2588%25B6&rsv_pq=e4a3036f000068d3&rsv_t=3d7agel4A12fO8Kqb7LiBzOPfffQl8FB3JnQ3uX4HsbXjjchpMRx9m5zMG4&rqlang=cn&rsv_enter=0&rsv_n=2&rsv_sug3=1&bs=%E5%85%85%E7%94%B5%E6%A1%A9%E7%9B%91%E6%8E%A7%E7%B3%BB%E7%BB%9F%20%E8%BD%AF%E4%BB%B6%E5%AE%9A%E5%88%B6';
    await page.goto(pageUrl, {
      waitUtil: 'load'
    });

    var task = {
      doc: {
        userName: 'scott',
        engine: 'baidu',
        link: 'ioliz.com',
        keyword: '数字标牌 发布系统 定制开发',
        originRank: 41,
      },
      action: jobAction.Polish,
      end: function (doc) {
        console.log('polishjober execute doc rank', doc.rank);
        expect(doc.rank).to.be.lt(40);
      },
    };

    var rank = await pageTaskJob.pageSkipScanClick(page,task);
   // done();
  //  await browser.close();
  })();
})

// it('execute single task return rank', (done) => {
//   var task = {
//     doc: {
//       userName: 'scott',
//       engine: 'baidu',
//       link: 'ioliz.com',
//       keyword: '软件定制',
//       rank: 0,
//     },
//     action: jobAction.SCAN,
//     end: function (doc) {
//       console.log('scanjober execute doc rank', doc.rank);
//       expect(doc.rank).to.be.lt(40);
//     },

//   };
//   pageTaskJob.execute(task).then(() => {
//     console.log('execute single task return rank end...')
//     done();
//   })
// });



