import React, {Component} from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

export default class Header extends Component {
  render() {
    
    return (
      <div className="d-flex flex-column flex-md-row align-items-center p-3 px-md-4 mb-3 bg-white border-bottom box-shadow">
      <h5 className="my-0 mr-md-auto font-weight-normal">易优排名</h5>
      <nav className="my-2 my-md-0 mr-md-3">
        {/*<Link className="p-2 text-dark" to="/start">特性</Link>*/}
        <Link className="p-2 text-dark" to="/keyword">关键字</Link>
        {this.props.userName=='admin' && <Link className="p-2 text-dark" to="/charge">充值</Link>}
        {this.props.userName=='admin' && <Link className="p-2 text-dark" to="/users">会员列表</Link>}
        <Link className="p-2 text-dark" to="/price">服务</Link>
      </nav>
      <button className="btn btn-outline-primary"  onClick={this.props.unsetClient}>{this.props.userName?'登出':'登录'}</button>
    </div>
    );
  }
}
