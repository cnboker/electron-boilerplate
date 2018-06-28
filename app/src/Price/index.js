import React, {Component} from 'react'
import {Link} from 'react-router-dom'
export default class Index extends Component {
  render() {
    return (
      <div>
        <div className="pricing-header px-3 py-3 pt-md-5 pb-md-4 mx-auto text-center">
          <p className="lead">升级为付费会员能够更好，更快的加速网站的排名.</p>
        </div>
        <div className="container">
          <div className="card-deck mb-3 text-center">
            <div className="card mb-4 box-shadow">
              <div className="card-header">
                <h4 className="my-0 font-weight-normal">免费帐户</h4>
              </div>
              <div className="card-body">
                <h1 className="card-title pricing-card-title">¥0
                  <small className="text-muted">/ 月</small>
                </h1>
                <ul className="list-unstyled mt-3 mb-4">
                  <li>优化3个关键字</li>
                  <li>优化1网站</li>
                  <li>需安装客户端并保持运行</li>
                  <li>远程技术支持</li>
                  <li>&nbsp;</li>
                </ul>
                <Link to="/login" className="btn btn-lg btn-block btn-outline-primary">注册</Link>
              </div>
            </div>
            <div className="card mb-4 box-shadow">
              <div className="card-header">
                <h4 className="my-0 font-weight-normal">标准帐户</h4>
              </div>
              <div className="card-body">
                <h1 className="card-title pricing-card-title">¥49
                  <small className="text-muted">/ 月</small>
                </h1>
                <ul className="list-unstyled mt-3 mb-4">
                  <li>关键字不限</li>
                  <li>网站不限</li>
                  <li>无需安装客户端</li>
                  <li>远程技术支持</li>
                  <li>&nbsp;</li>
                </ul>
                <button type="button" className="btn btn-lg btn-block btn-primary">升级为标准账号</button>
              </div>
            </div>
            <div className="card mb-4 box-shadow">
              <div className="card-header">
                <h4 className="my-0 font-weight-normal">高级帐户
                </h4>
              </div>
              <div className="card-body">
                <h1 className="card-title pricing-card-title">？
                  <small className="text-muted"></small>
                </h1>
                <ul className="list-unstyled mt-3 mb-4">
                <li>根据客户需求定制开发</li>
                <li>&nbsp;</li>
                <li>&nbsp;</li>
                <li>&nbsp;</li>
                <li>&nbsp;</li>
                </ul>
                <button type="button" className="btn btn-lg btn-block btn-primary">联系我们</button>
              </div>
            </div>
          </div>

        </div>
      </div>
    )
  }
}
