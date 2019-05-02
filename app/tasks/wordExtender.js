var sleep = require("./sleep");
var jobContext = require("./jobContext");
var random = require("./random");
var browser;

exports.search = async function(input) {
  try {
    browser = await jobContext.puppeteer.launch({
      headless: process.env.NODE_ENV == "production",
      executablePath: (() => {
        return process.env.ChromePath;
      })()
    });
   
    const page = await browser.newPage();
    const pageUrl = "https://www.sogou.com";
   
    await page.goto(pageUrl, {
      waitUtil: "load"
    });

    await page.waitForSelector("#query", {
      visible: true
    });
    await page.focus("#query");
    await page.$eval("#query", (el, input) => (el.value = input), input);
    //page.type("#query", input);

    await sleep(random(1000, 5000));

    await page.evaluate(() => {
      document.querySelector("#stb").click();
    });
    await sleep(random(1000, 5000));

    var keywords = [];
    var loop = [1,2]
    for (let i of loop) {
      var tmpArray = await page.$$eval("div.rb a", as =>
        as.map(a => {
          return a.innerText;
        })
      );
      keywords.push(
        ...tmpArray.filter(m => {
          return m.length < 10;
        })
      );
      var tmpArray = await page.evaluate(keyword => {
        var nodes = document.querySelectorAll(
          "#hint_container a"
        );
        var arr = [...nodes];
        return arr.map(x => {
          return x.innerText;
        });
      });
      keywords.push(...tmpArray);

      await page.evaluate(() => {
        document.querySelector("#sogou_next").click();
      });

      await page.waitForNavigation();

      await sleep(random(1000, 5000));
    }
    console.log('keywords inner',keywords)
    browser.close();
    browser = null;
    //remove duplication
    return keywords.filter(function(item, pos) {
      return keywords.indexOf(item) == pos && item.length > 3 && item !== '翻译此页';
    });
  } catch (e) {
    console.log('exception',e);
    if (browser) {
      console.log("wordextender browser exception closed");
      browser.close();
      browser = null;
    }
    return [];
  }
};
