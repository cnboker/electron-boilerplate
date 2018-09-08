var sleep = require('./sleep')
var scroll = require('./scroll')
var random = require('./random')
var jobAction = require('./jobAction')
var jobContext = require('./jobContext')
const SCAN_MAX_PAGE = 10;

async function execute(task) {
    if (jobContext.busy || jobContext.puppeteer == undefined) return;
    jobContext.busy = true;
    task.doc.engine = 'baidu'
    const browser = await jobContext.puppeteer.launch({
        headless: (process.env.NODE_ENV == 'production'),
        executablePath: (() => {
            return process.env.ChromePath;
        })()
    })

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
            task.end(task.doc)
            jobContext.busy = false;
            browser.close();
        })
        .catch((err) => {
            jobContext.busy = false;
            browser.close();
            console.error(err)
        });
}

async function singleTaskProcess(page, task) {
    if (task == undefined) return;

    var pageIndex = 0;
    var doc = task.doc;
    var keyword = doc.keyword;
    try {
        await inputKeyword(page, keyword);

        const nextpageSelector = '#page > a[href$="rsv_page=1"]'

        await sleep(2000);

        //const selector = '#content_left.result c-container'

        while (pageIndex < SCAN_MAX_PAGE) {
            const rank = await pageRank(page, doc.link, pageIndex);
            doc.rank = rank;
            if (rank != -1) {
                if (task.action == jobAction.Polish) {
                    findLinkClick(page, doc.link)
                    await sleep(random(5000, 20000))
                }
                break;
            }

            scroll(page);
            page.click(nextpageSelector);
            //wait load new page
            await page.waitForNavigation({
                waitUntil: 'load'
            });
            if (task.action == jobAction.Polish) {
                await sleep(random(5000, 10000))
            } else {
                await sleep(random(5000, 10000))
            }
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
    //#\31 > div.f13
    var text = await page.$eval(selector, div => {
        return div.innerText
    })
    //console.log('div', text)
    return text.indexOf(keyword) > 0;
}

//检查当前页是否包含特定链接
//match:特定链接，比如ioliz.com,pageIndex:分页
//return -1 表示为找到匹配链接
async function pageRank(page, match, pageIndex) {
    const selector = '#content_left div.f13'
    var currentRank = await page.$$eval(selector, (links, match) => {
        return links.findIndex(function (element) {
            return element.innerText.indexOf(match) >= 0
        });
    }, match);
    console.log('currentRank=', currentRank)
    if (currentRank >= 0) return pageIndex * 10 + currentRank + 1;
    return -1;
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

exports.execute = execute;
exports.pageRank = pageRank;