require("../../config");
var jobContext = require("../../tasks/jobContext");

describe("word query", () => {
  beforeAll(async () => {
    await page.goto("https://google.com");
  });

  it("word query should return result", async () => {
    // jobContext.puppeteer = require("puppeteer");
    // const worder = require("../../tasks/wordExtender");
    // var result = await worder.search("软件定制");
    // console.log("result", result);
    // expect(result.length > 0).toBeTruthy();
  }, 30000);

  //end
});
