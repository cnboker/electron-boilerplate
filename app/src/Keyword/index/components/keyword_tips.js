import React from "react";

export default class KeywordTips extends React.Component {
  render() {
    return (
      <div style={{fontSize:'11pt'}}>
       <p>注：提交关键字后，保持连网，10分钟内会出现初始排名数据。如果一次提交较多关键词，排名数据会陆续出来。<br /> </p>
<p>1.初始排名数据在1~120之间，属于有效优化范围内的关键词。</p>
<p>2.排名数据显示为120+，则表明系统未在搜索引擎自然搜索结果前12页中找到目标网站。</p>
<p>3.若较长时间后，新提交的关键词排名数据仍然全部为0，可能是系统未能正常检测。请查看【帮助】介绍方法进行处理。</p>
      </div>
    );
  }
}
