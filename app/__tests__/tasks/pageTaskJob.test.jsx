require('../../config')
var jobContext = require("../../tasks/jobContext");
var jobAction = require("../../tasks/jobAction");
var pageTaskJob = require("../../tasks/pageTaskJob");

describe("pageTaskjob test", () => {
  beforeAll(async () => {
    await page.goto("https://google.com");
  });
  it("query dynamicRank return great 0", async () => {
    await expect(page.title()).resolves.toMatch('Google1');
    // jobContext.puppeteer = require("puppeteer");
    // var task = {
    //   doc: {
    //     userName: "scott",
    //     engine: "baidu",
    //     link: "土工膜土工布",
    //     keyword: "土工膜",
    //     originRank: 5,
    //     dynamicRank: 0
    //   },
    //   action: jobAction.Polish,
    //   end: function(doc) {
    //     expect(doc.dynamicRank > 0).toBeTruthy();
    //   }
    // };
    // jobContext.puppeteer = require("puppeteer");
    // await pageTaskJob.execute(task);
  },30000);

  //end
});
