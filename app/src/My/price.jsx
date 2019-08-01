import React, { Component } from "react";
import { Link } from "react-router-dom";

export default class Price extends Component {
  render() {
    const authenticated = localStorage.getItem("token") != undefined;
    const linkAction =
      this.props.action == undefined ? true : this.props.action;
    return (
      <div className="">
        <div className="pricing-header px-3 py-3 pt-md-5 pb-md-4 mx-auto text-center">
          <p className="lead">升级VIP,更多优化更划算.</p>
        </div>
        <div>
          <div className="card-deck mb-3 text-center">
            <div className="card mb-6 box-shadow">
              <div className="card-header">
                <h4 className="my-0 font-weight-normal">免费帐户</h4>
              </div>
              <div className="card-body">
                <h1 className="card-title pricing-card-title">
                  ¥0
                  <small className="text-muted">/ 月</small>
                </h1>
                <ul className="list-unstyled mt-3 mb-4">
                  <li>同时优化词量限制5个以内</li>
                  <li>需安装客户端</li>
                  <li>远程技术支持</li>
                  <li>&nbsp;</li>
                </ul>
                {!authenticated && (
                  <Link
                    to="/login"
                    className="btn btn-lg btn-block btn-outline-primary"
                  >
                    注册
                  </Link>
                )}
              </div>
            </div>
            <div className="card mb-6 box-shadow">
              <div className="card-header">
                <h4 className="my-0 font-weight-normal">VIP帐户</h4>
              </div>
              <div className="card-body">
                <h1 className="card-title pricing-card-title">
                  ¥199
                  <small className="text-muted">/ 月</small>{' '}
                  ¥1999
                  <small className="text-muted">/ 年</small>
                </h1>
                <ul className="list-unstyled mt-3 mb-4">
                  <li>可以同时优化上万关键词</li>
                  <li>多个网站操作效率更高</li>
                  <li>需安装客户端</li>
                  <li>远程技术支持</li>
                  <li>&nbsp;</li>
                </ul>
                {linkAction && (
                  <Link to="/pay" className="btn btn-lg btn-block btn-primary">
                    升级为标准账号
                  </Link>
                )}
              </div>
            </div>
            {/* <div className="card mb-4 box-shadow">
              <div className="card-header">
                <h4 className="my-0 font-weight-normal">企业帐户</h4>
              </div>
              <div className="card-body">
                <h1 className="card-title pricing-card-title">
                  ？<small className="text-muted" />
                </h1>
                <ul className="list-unstyled mt-3 mb-4">
                  <li>根据客户需求定制收费</li>
                  <li>无需安装客户端</li>
                  <li>&nbsp;</li>
                  <li>&nbsp;</li>
                  <li>&nbsp;</li>
                </ul>
                {linkAction && (
                  <Link
                    to="/contact"
                    className="btn btn-lg btn-block btn-primary"
                  >
                    联系我们
                  </Link>
                )}
              </div>
            </div> */}
          </div>
        </div>
      </div>
    );
  }
}
