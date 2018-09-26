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

    const pageUrl = 'https://www.baidu.com/s?ie=utf-8&f=3&rsv_bp=1&tn=baidu&wd=%E7%9B%B4%E6%B5%81%E9%AB%98%E5%8E%8B%E5%8F%91%E7%94%9F%E5%99%A8&rsv_spt=3&oq=%25E7%259B%25B4%25E6%25B5%2581%25E9%25AB%2598%25E5%258E%258B%25E5%258F%2591%25E7%2594%259F%25E5%2599%25A8&rsv_pq=a69d9580000381b6&rsv_t=f5e8pIo7QWrxc8GEScvqRqTG%2BJgn2qEUHqScQOy%2BjyPOKqCcCdqJuAjmKxc&rqlang=cn&rsv_enter=0&prefixsug=%25E7%259B%25B4%25E6%25B5%2581%25E9%25AB%2598%25E5%258E%258B%25E5%258F%2591%25E7%2594%259F%25E5%2599%25A8&rsp=0&rsv_sug=1';
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

    const pageUrl = 'https://www.baidu.com/s?ie=utf-8&f=3&rsv_bp=1&tn=baidu&wd=%E7%9B%B4%E6%B5%81%E9%AB%98%E5%8E%8B%E5%8F%91%E7%94%9F%E5%99%A8&rsv_spt=3&oq=%25E7%259B%25B4%25E6%25B5%2581%25E9%25AB%2598%25E5%258E%258B%25E5%258F%2591%25E7%2594%259F%25E5%2599%25A8&rsv_pq=a69d9580000381b6&rsv_t=f5e8pIo7QWrxc8GEScvqRqTG%2BJgn2qEUHqScQOy%2BjyPOKqCcCdqJuAjmKxc&rqlang=cn&rsv_enter=0&prefixsug=%25E7%259B%25B4%25E6%25B5%2581%25E9%25AB%2598%25E5%258E%258B%25E5%258F%2591%25E7%2594%259F%25E5%2599%25A8&rsp=0&rsv_sug=1';
    await page.goto(pageUrl, {
      waitUtil: 'load'
    });

    var task = {
      doc: {
        userName: 'scott',
        engine: 'baidu',
        link: 'www.whhuatian.com',
        keyword: '直流高压发生器',
        originRank: 66,
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



