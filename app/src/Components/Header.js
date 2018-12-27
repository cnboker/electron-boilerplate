import React, {Component} from "react";
import {BrowserRouter as Router, Route, Link} from "react-router-dom";

export default class Header extends Component {
  navs() {
    if (this.props.userName === "admin") {
      return (
        <nav className="my-2 my-md-0 mr-md-3">

          <Link className="p-2 text-dark" to="/users/keywords/__today__">
            今日关键词
          </Link>
          <Link className="p-2 text-dark" to="/charge">
            充值
          </Link>
          <Link className="p-2 text-dark" to="/users">
            会员列表
          </Link>
          <Link className="p-2 text-dark" to="/pool">
            任务池
          </Link>
          <Link className="p-2 text-dark" to="/sn">
            充值码
          </Link>

        </nav>
      );
    } else {
      return (
        <nav className="my-2 my-md-0 mr-md-3">
          <Link className="p-2 text-dark" to="/keyword">
            排名监控
          </Link>
          <Link className="p-2 text-dark" to="/qa">
            问答
          </Link>
          <Link className="p-2 text-dark" to="/setting">
            设置
          </Link>
          <Link className="p-2 text-dark" to="/price">
            会员
          </Link>
          <Link className="p-2 text-dark" to="/start">
            帮助
          </Link>
        </nav>
      );
    }
  }

  render() {
    return (
      <div
        className="d-flex flex-column flex-md-row align-items-center p-3 px-md-4 mb-3 bg-white border-bottom box-shadow">
        <h5 className="my-0 mr-md-auto font-weight-normal">钢铁侠</h5>

        {this.navs()}
        <button className="btn btn-outline-primary" onClick={this.props.unsetClient}>
          {this.props.userName
            ? "登出"
            : "登录"}
        </button>
      </div>
    );
  }
}
