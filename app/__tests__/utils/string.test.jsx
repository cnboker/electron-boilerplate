import { extractRootDomain,customSplit } from "~/src/utils/string";

describe("string", () => {
  it("www.ioliz.com shoud return ioliz.com", () => {
    expect(extractRootDomain("http://www.ioliz.com/index.html")).toEqual(
      "ioliz.com"
    );
  });
  it("www.hao123.com.cn shoud return hao123.com.cn", () => {
    expect(extractRootDomain("http://www.hao123.com.cn/index.html")).toEqual(
      "hao123.com.cn"
    );
  });

  it("news.qq.com shoud return news.qq.com", () => {
    expect(extractRootDomain("http://news.qq.com/index.html")).toEqual(
      "news.qq.com"
    );
  });

  it("split shoud return array list", () => {
      var str =`
        aaaaa,bbbb,cccc dddd
        eeee
        ffff
        ggg
      
      `;
      var arr = customSplit(str)
    expect(arr.length).toEqual(4);
      
  });
  //end
});
