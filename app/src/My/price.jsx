import React, { Component } from "react";
import { Link } from "react-router-dom";
export default class Price extends Component {
  render() {
    return (
      <div className="">
        <table className="table table-bordered table-striped table-sm">
          <thead>
            <tr>
              <th>功能</th>
              <th>免费用户</th>
              <th>VIP</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>收费标准</td>
              <td>0</td>
              <td>
                超值价199元/月 超值价1999元/年{" "}
                <Link to="/pay" className="btn btn-primary btn-sm">
                  开通VIP
                </Link>
              </td>
            </tr>
            <tr>
              <td>排名查询</td>
              <td>是</td>
              <td>是</td>
            </tr>
            <tr>
              <td>排名监控</td>
              <td>是</td>
              <td>是</td>
            </tr>
            <tr>
              <td>提交关键词数量</td>
              <td style={{ color: "red" }}>10 000个</td>
              <td style={{ color: "red" }}>100 000个</td>
            </tr>
            <tr>
              <td>排名数据保存</td>
              <td>否</td>
              <td>--</td>
            </tr>
            <tr>
              <td>排名跟踪</td>
              <td>是</td>
              <td>是</td>
            </tr>
            <tr>
              <td>智能拓词</td>
              <td>是</td>
              <td>是</td>
            </tr>
            <tr>
              <td>优化记录</td>
              <td>是</td>
              <td>是</td>
            </tr>
            <tr>
              <td>推荐奖励</td>
              <td>是</td>
              <td>是</td>
            </tr>
            <tr>
              <td>词库导出</td>
              <td>是</td>
              <td>是</td>
            </tr>
            <tr>
              <td>排名优化</td>
              <td style={{ color: "red" }}>限5词</td>
              <td style={{ color: "red" }}>100 000个</td>
            </tr>
          </tbody>
        </table>
        <p>更多实用功能即将推出，敬请等侯</p>
      </div>
    );
  }
}
