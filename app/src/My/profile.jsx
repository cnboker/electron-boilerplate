import React, {Component} from "react";
import moment from "moment";
import {Link} from "react-router-dom";
import Account from "./account";

export default class ProfileComponent extends Component {
  render() {
    const model = this.props.model;
    return (
      <div>
        <div >
          <ul className="list-group">
            <li className="list-group-item active">{model.grade}</li>
            <li className="list-group-item">
              昵称 : {model.nickname == ""
                ? "未设置"
                : model.nickname}
              <span className="float-right">
                <Link to="/pay" className="btn btn-primary">
                  充值
                </Link>
              </span>
            </li>
            <li className="list-group-item">
              账号 : {model.userName}

            </li>
            <li className="list-group-item">
              到期日期 : {moment(model.expiredDate).format("YYYY-MM-DD")}
            </li>
          </ul>
        </div>
        <div className="mt-3">
          <Account balance={model.balance}>
            <h3>账单</h3>
          </Account>
        </div>
      </div>
    );
  }
}
