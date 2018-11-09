var sleep = require("./sleep");
var jobContext = require("./jobContext");

exports.search = async function (input) {
    const browser = await jobContext.puppeteer.launch({
        headless: process.env.NODE_ENV == "production",
        executablePath: (() => {
            return process.env.ChromePath;
        })()
    });

    const page = await browser.newPage();
    const pageUrl = "https://www.soso.com/";

    await page.goto(pageUrl, {
        waitUtil: "load"
    });

    await page.waitForSelector("#query", {
        visible: true
    });
    await page.focus("#query");
    await page.$eval("#query", (el, input) => (el.value = input), input);
    //page.type("#query", input);

    await sleep(2000);

    await page.evaluate(() => {
        document.querySelector("#stb").click();
    });
    await sleep(2000);

    var keywords = [];

    for (var i = 0; i < 3; i++) {

        var tmpArray = await page.$$eval('div.rb a', as => as.map(a => {
            return a.innerText
        }));
        keywords.push(...tmpArray.filter(m => {
            return m.length < 10
        }))
        var tmpArray = await page.evaluate(keyword => {
            var nodes = document.querySelectorAll("#sogou_wrap_id > div.hintBox  a");
            var arr = [...nodes];
            return arr.map(x => {
                return x.innerText;
            });
        });
        keywords.push(...tmpArray)

        await page.evaluate(() => {
            document.querySelector("#sogou_next").click();
        });

        await page.waitForNavigation();

        await sleep(2000);
    }
    //remove duplication
    return keywords.filter(function (item, pos) {
        return keywords.indexOf(item) == pos && item.length > 3
    })
}