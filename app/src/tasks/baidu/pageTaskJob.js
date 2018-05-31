var sleep = require('/src/utils/sleep')
var scroll = require('src/utils/scroll')
var random = require('src/utils/random')
var jobContext = require('./jobContext');

const SCAN_MAX_ROW = 100;

async function run() {
    try {

        //await page.waitForSelector('#content_left');

        var keyword = matchUrl
        const selector = '#content_left.result c-container'

        var pageIndex = 1;
        const nextpageSelector = '#page > a[href$="rsv_page=1"]'

        while (pageIndex < pageCount) {
            sleep(1000)
            if (await this.pageHasKeyword(page, keyword)) {
                this.findLinkClick(page, keyword)
                console.log(' has found page index:' + pageIndex);
                break;
            }
            scroll(page);
            page.click(nextpageSelector);
            //wait load new page
            await page.waitForNavigation({
                waitUntil: 'load'
            });


            var seconds = random(10000, 30000);
            console.log('sencods', seconds)
            sleep(seconds)

            pageIndex++
        }

    } catch (e) {
        console.error(e)
    }
}



//输入框模拟输入关键字
async function inputKeyword(page, input) {
    const pageUrl = 'http://www.baidu.com'
    await page.goto(pageUrl, {
        waitUtil: 'load'
    });

    await page.focus('#kw')
    await page.waitFor('#kw');

    await page.$eval('#kw', (el, input) => el.value = input, input);

    await page.click('#su');
}

//查找当前页是否包含特定关键字
async function pageHasKeyword(page, keyword) {
    const selector = '#content_left'
    //await page.waitForSelector(selector);

    var text = await page.$eval(selector, div => {
        return div.innerText
    })
    //console.log('div', text)
    return text.indexOf(keyword) > 0;
}

//查找包含关键字的链接，并同时点击该链接
async function findLinkClick(page, keyword) {

    var selector = '//a[contains(text(), "' + keyword + '")]'
    const linkHandler = (await page.$x(selector))[0];
    if (linkHandler) {
        await linkHandler.click();
    } else {
        throw new Error(`Link not found`);
    }

}

module.exports = run;