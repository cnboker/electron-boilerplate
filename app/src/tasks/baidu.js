class BaiduSEO {
    constructor(){
        //super();
        this.finished = true;
    }
    
    async  bot(page, matchUrl, input, pageCount = 10) {
        if(!this.finished)return
        this.finished = false;
        try {
            const pageUrl = 'http://www.baidu.com'
            await page.goto(pageUrl, {
                waitUtil: 'load'
            });


            await page.focus('#kw')
            await page.waitFor('#kw');

            await page.$eval('#kw', (el, input) => el.value = input, input);

            await page.click('#su');
            //await page.waitForSelector('#content_left');

            var keyword = matchUrl
            const selector = '#content_left.result c-container'

            var pageIndex = 1;
            const nextpageSelector = '#page > a[href$="rsv_page=1"]'
            var sleep = require('../utils/sleep')
            var scroll = require('../utils/scroll')
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

                var r = require('../utils/random')
                var seconds = r(10000, 30000);
                console.log('sencods', seconds)
                sleep(seconds)

                pageIndex++
            }
            
        } catch (e) {
            console.error(e)
        }finally{
            this.finished = true;
        }


        //console.log('page index:' + pageIndex);
        //end
    }


    async  pageHasKeyword(page, keyword) {
        const selector = '#content_left'
        //await page.waitForSelector(selector);

        var text = await page.$eval(selector, div => {
            return div.innerText
        })
        //console.log('div', text)
        return text.indexOf(keyword) > 0;
    }

    async  findLinkClick(page, keyword) {

        var selector = '//a[contains(text(), "' + keyword + '")]'
        const linkHandler = (await page.$x(selector))[0];
        if (linkHandler) {
            await linkHandler.click();
        } else {
            throw new Error(`Link not found`);
        }

    }
}

module.exports = BaiduSEO;