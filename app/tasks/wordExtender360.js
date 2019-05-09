var jobContext = require("./jobContext");
var browser;

exports.search = async function(input) {
  browser = await jobContext.puppeteer.launch({
    headless: true,
    executablePath: (() => {
      return process.env.ChromePath;
    })()
  });

  const p1 = await browser.newPage();
  await p1.setRequestInterception(true);
  p1.on("request", request => {
    if (request.resourceType() === "image") request.abort();
    else request.continue();
  });

  const p2 = await browser.newPage();
  var keywords = [];
  return Promise.all([search360(p1, input), searchBaidu(p2, input)])
    .then(([r1, r2]) => {
      keywords.push(...r1);
      keywords.push(...r2);
      return keywords.filter(function(item, pos) {
        return keywords.indexOf(item) == pos && item.length > 3;
      });
    })
    .then(keywords => {
      browser.close();
      return keywords;
    })
    .catch(e => {
      console.log(e);
      browser.close();
      return keywords;
    });
};

async function search360(page, input) {
  const pageUrl = "https://www.so.com/s?q=" + input;

  await page.goto(pageUrl, { waitUtil: "load" });

  return await page.$$eval("#rs a", as =>
    as.map(a => {
      return a.innerText;
    })
  );
}

async function searchBaidu(page, input) {
  var pageUrl = "https://www.baidu.com/s?wd=" + input;

  await page.goto(pageUrl, { waitUtil: "load" });

  return await page.$$eval("#rs a", as =>
    as.map(a => {
      return a.innerText;
    })
  );
}
