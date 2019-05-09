require('../../config')
var jobContext = require("../../tasks/jobContext");
var jobAction = require("../../tasks/jobAction");
var pageTaskJob = require("../../tasks/pageTaskJob");

describe("pageTaskjob test", () => {
 
  it("query dynamicRank return great 0", async () => {
    //await expect(page.title()).resolves.toMatch('Google1');
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
    //  await pageTaskJob.singleTaskProcess(page,task);
    //  console.log('task rank',task.doc.rank)
  },30000);

  it('keyword input test',async ()=>{
    // await pageTaskJob.inputKeyword(page,'手机')
    // await expect(page).toMatch('手机')
  },30000)

  it('query indexer return great 0',async()=>{
    await pageTaskJob.inputKeyword(page,'手机')
    var result = await pageTaskJob.resultIndexer(page);
    expect(result).toBeGreaterThan(0)
  }, 30000)


  //end
});
