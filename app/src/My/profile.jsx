import React, { Component } from "react";
import moment from "moment";
import { Link } from "react-router-dom";
import Account from "./account";

export default class ProfileComponent extends Component {
  expiredRender() {
    const model = this.props.model;
    var less10 = moment(model.expiredDate).diff(moment(), "days");
    if (less10 < 0) {
      return (
        <li className="list-group-item">
          VIP 已过期 <span style={{ color: "red" }}>{Math.abs(less10)}</span> 天
        </li>
      );
    } else {
      return null;
    }
  }
  render() {
    const model = this.props.model;

    return (
      <div>
        <div>
          <ul className="list-group">
            <li className="list-group-item active">用户中心</li>

            <li className="list-group-item">
              昵称 : {model.nickname == "" ? "未设置" : model.nickname}
            </li>
            <li className="list-group-item">
              账号 : {model.userName}
             
            </li>
            <li className="list-group-item">级别 : {model.grade}</li>
            <li className="list-group-item">
              VIP 有效期截止 : {moment(model.expiredDate).format("YYYY-MM-DD")}
              <span className="float-right">
                <Link to="/pay" className="btn btn-primary btn-sm">
                  现在续费
                </Link>
              </span>
            </li>
            {this.expiredRender()}
          </ul>
        </div>
        <div className="mt-3">
          <Account balance={model.balance}>
            <h3>账单明细</h3>
          </Account>
        </div>
      </div>
    );
  }
}
