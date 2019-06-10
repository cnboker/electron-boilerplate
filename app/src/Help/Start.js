import React, {Component} from "react";

export default class Start extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    var imageRoot = require("path").resolve() + "/app";
    return (
      <div className="row">
        <div className="card">
          <div className="card-body">
         
            <p class="p1">
              <span class="s1">如何使用</span>
              <span class="s2">?</span>
            </p>
            <p class="p2">
              <span class="s1">登录软件后，在</span>
              <span class="s3">&ldquo;</span>
              <span class="s4">
                <strong>排名监测</strong>
              </span>
              <span class="s3">&rdquo;</span>
              <span class="s1">界面，点击左上方的</span>
              <span class="s3">
                &ldquo;</span>
              <span class="s4">
                <strong>新建</strong>
              </span>
              <span class="s3">&rdquo;
              </span>
              <span class="s1">，提交关键词和对应的网址就可以。</span>
            </p>
            <p class="p2">
              <span class="s3"><br/>
              </span>
              <span class="s1">提交后，保持软件处在连网挂机状态，系统会自动运行优化工作</span>
              <span class="s3"><br/>
                <br/>
              </span>
              <span class="s1">特别说明：</span>
              <span class="s3"><br/>
              </span>
              <span class="s1">搜索引擎如百度，自然搜索结果每页</span>
              <span class="s3">10</span>
              <span class="s1">个页面，页面出现在</span>
              <span class="s3">10</span>
              <span class="s1">页以后也就是排名在</span>
              <span class="s3">100</span>
              <span class="s1">以上的网页默认质量相对较低。当前钢铁侠系统的默认规则是，只针对初始排名在</span>
              <span class="s3">120</span>
              <span class="s1">名以内的关键词进行优化。</span>
              <span class="s3"><br/>
                <br/>
              </span>
              <span class="s1">正常情况下，关键词提交后，保持软件运行状态，两分钟内会出现初始排名数据。如果一次提交关键词数量过多，时间会相对延长。</span>
              <span class="s3"><br/>
              </span>
            </p>
            <p class="p3">
              <span class="s1">
                <strong>情况</strong>
              </span>
              <span class="s5">
                <strong>1</strong>
              </span>
              <span class="s1">
                <strong>、初始排名在</strong>
              </span>
              <span class="s5">
                <strong>1-120</strong>
              </span>
              <span class="s1">
                <strong>以内</strong>
              </span>
            </p>
            <p class="p4">
              <span class="s1">表明系统正常工作，关键词处在有效状态。只须保持软件连网挂机状态即可，系统会自动安排执行优化工作。将钢铁侠最小化后台挂机即可，不影响使用电脑。</span>
              <span class="s5"><br/>
              </span>
            </p>
            <p class="p5">
              <span class="s6">
                <strong>情况</strong>
              </span>
              <span class="s5">
                <strong>2</strong>
              </span>
              <span class="s6">
                <strong>、初始排名数据长时间为</strong>
              </span>
              <span class="s5">
                <strong>0</strong>
              </span>
              <span class="s6">
                <strong>，没有变化</strong>
              </span>
            </p>
            <p class="p4">
              <span class="s1">此时说明系统检测工作没有正常启动。请关掉软件，再重新启动就会恢复正常。</span>
              <span class="s5"><br/>
              </span>
              <span class="s1">如果你电脑上装有</span>
              <span class="s5">360</span>
              <span class="s1">系列软件，请退出后再尝试。</span>
              <span class="s5"><br/>
                <br/>
              </span>
              <span class="s1">如果仍没有显示正常数据，请换台电脑尝试或重新安装软件或联系售后人员解决。</span>
              <span class="s5"><br/>
                <br/>
              </span>
              <span class="s1">这种情况大多是操作系统不完整导致，推荐安装原版</span>
              <span class="s5">Windos
              </span>
              <span class="s1">各种精简版或破解版操作系统会缺失某些必要系统文件。钢铁侠支持</span>
              <span class="s5">Windos 7
              </span>
              <span class="s1">及以上版本操作系统</span>
              <span class="s5"><br/>
              </span>
            </p>
            <p class="p3">
              <span class="s1">
                <strong>情况</strong>
              </span>
              <span class="s5">
                <strong>3</strong>
              </span>
              <span class="s1">
                <strong>、如果初始排名数据显示为</strong>
              </span>
              <span class="s5">
                <strong>120+
                </strong>
              </span>
              <span class="s1">
                <strong>，状态显示停止怎么办？</strong>
              </span>
            </p>
            <p class="p4">
              <span class="s1">表明当前关键词排名位置过于靠后，系统暂不进行优化处理</span>
            </p>
            <p class="p4">
              <span class="s5"><br/>
              </span>
              <span class="s1">
                <strong>解决思路</strong>
              </span>
              <span class="s5"><br/>
              </span>
              <span class="s1">先做相关的长尾关键词，以保障提交的关键词初始排名在</span>
              <span class="s5">120</span>
              <span class="s1">以内，系统能够执行优化。长尾关键词优化一段时间，对应的主关键词也会自动往前提升排名，直到排名进入</span>
              <span class="s5">120</span>
              <span class="s1">以内，再专门进行优化这个主关键词。</span>
              <span class="s5"><br/>
                <br/>
              </span>
              <span class="s1">
                <strong>解决方法</strong>
              </span>
              <span class="s5">
                <strong>A&nbsp;</strong><br/>
              </span>
              <span class="s1">直接输入关键词和域名这样作为组合关键词使用，这样在搜索里就可以确保排名靠前。优化处理一段时后，关键词的对应排名就会往前排。如果进入</span>
              <span class="s5">120</span>
              <span class="s1">以内，就可以按常规操作方法优化处理。</span>
              <span class="s5"><br/>
                <br/>
                <em>*
                </em>
              </span>
              <span class="s1">收录较少的新网站，可采取这种方式，快速增进收录。</span>
              <span class="s5">
                <em>&nbsp;</em><br/>
                <br/>
              </span>
              <span class="s1">
                <strong>解决方法</strong>
              </span>
              <span class="s5">
                <strong>B&nbsp;</strong><br/>
              </span>
              <span class="s1">可以根据这个关键词，先做对应的长尾词，使用多个长尾词进行优化。相关长尾词的排名提升的同时，主关键词的排名也会自动往上提升。等主关键词的排名进入</span>
              <span class="s5">120</span>
              <span class="s1">内，就可以按常规方式操作了。</span>
            </p>
            <p class="p6">&nbsp;</p>
            <p class="p5">
              <span class="s6">
                <strong>名词解释</strong>
              </span>
            </p>
            <p class="p4">
              <span class="s1">
                <strong>关键词排名</strong>
              </span>
              <span class="s5">&mdash;&mdash;</span>
              <span class="s1">在搜索引擎搜索某个关键词时，目标网站出现的排列位置。一般，搜索引擎自然搜索结果每个页面会提供</span>
              <span class="s5">10</span>
              <span class="s1">个页面信息。</span>
            </p>
            <p class="p4">
              <span class="s5"><br/>
              </span>
              <span class="s1">注意，各网站排名位置会经常变动，且某些关键词同一时间在不同地区，排名位置也可能不同。</span>
            </p>
            <p class="p4">
              <span class="s5"><br/>
              </span>
              <span class="s1">
                <strong>初始排名</strong>
              </span>
              <span class="s5">&mdash;&mdash;</span>
              <span class="s1">即关键词提交时，目标网站在搜索引擎的排列位置；</span>
            </p>
          
            <p class="p4">
              <span class="s5"><br/>
              </span>
              <span class="s1">
                <strong>最新排名</strong>
              </span>
              <span class="s5">&mdash;&mdash;</span>
              <span class="s1">即关键词在最近一次查询时，目标网站在搜索引擎的排列位置。钢铁侠的排名查询一天内会进行多次查询。</span>
            </p>
            <p class="p4">
              <span class="s5"><br/>
              </span>
              <span class="s1">
                <strong>收录量</strong>
              </span>
              <span class="s5">&mdash;&mdash;</span>
              <span class="s1">指搜索引擎根据查询关键词找到的相关结果页数量。钢铁侠工具提供的收录量以万为单。</span>
            </p>
            <p class="p4">
              <span class="s5"><br/>
              </span>
              <span class="s1">
                <strong>关键词商业热度</strong>
              </span>
              <span class="s5">&mdash;&mdash;</span>
              <span class="s1">钢铁侠对关键词商业价值共识进行判断的一种评价体系，从</span>
              <span class="s5">0~9</span>
              <span class="s1">共</span>
              <span class="s5">10</span>
              <span class="s1">个等级，数值越大，商业价值共识度越高，相应的竞争程度越激烈。关键词商业热度为</span>
              <span class="s5">0</span>
              <span class="s1">，只说明该关键词的商业价值尚未得到认可，并不代表其本身不具备商业价值。</span>
            </p>
            <p class="p4">
              <span class="s5"><br/>
              </span>
              <span class="s1">
                <strong>关键词排名走势</strong>
              </span>
              <span class="s5">&mdash;&mdash;</span>
              <span class="s1">从关键词提交时起到当前，对关键词排名变化进行统计，以折线图的方式展现出来，以方便用户更直观地分析排名变化。</span>
            </p>
          </div>
        </div>
      </div>
    );
  }
}
