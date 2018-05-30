
const puppeteer = require('puppeteer')

const jobContext = {
    busy:false,
    tasks:[]
}

module.exports = jobContext;

jobContext.browserPerpare = async function () {
    const browser = await puppeteer.launch({
        headless: false,
        //executablePath:'./resources/app/node_modules/puppeteer/.local-chromium/win64-555668/chrome-win32/chrome.exe'
    })
    jobContext.browser = browser;
}

jobContext.newPage = async function () {
    return await browser.newPage();
}

jobContext.browserClose = function () {
    if (jobContext.browser) {
        jobContext.browser.close();
    }
}

jobContext.addTask = function (task) {
    jobContext.tasks.push(task);
}

jobContext.getAccessToken = function(){
    var token = require('../../lib/auth')()
    if (token == null) {
        throw new "请重新登录进行验证"
    }
    return token.access_token;
}