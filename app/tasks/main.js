
var BaiduSEO = require('./baidu');
var schedule = require('node-schedule');
var moment = require('moment');

async function main() {
    const puppeteer = require('puppeteer')
    const browser = await puppeteer.launch({
        headless: false,
        //executablePath:'./resources/app/node_modules/puppeteer/.local-chromium/win64-555668/chrome-win32/chrome.exe'
    })
    const page = await browser.newPage();
    // var j = schedule.scheduleJob('1 * * * * *', function () {
    //     bot(browser, 'ioliz.com', '充电桩运营系统 软件定制服务', 10)
    // });

    //bot(page, 'ioliz.com', '软件定制', 10)
    console.log(moment().format());      
    //每分钟的第30秒触发

    var baiduSEO = new BaiduSEO();
    var j = schedule.scheduleJob('30 * * * * *', function () {
        console.log(moment().format());      
        baiduSEO.bot(page, 'ioliz.com', '软件定制', 10)
    });
    // schedule.scheduleJob('5 * * * * *', function () {
    //     bot(browser, 'ioliz.com', '软件定制服务', 10)
    // });


    // schedule.scheduleJob('10 * * * * *', function () {
    //     bot(browser, 'ioliz.com', '数字标牌 软件定制', 10)
    // });
};

module.exports = main;