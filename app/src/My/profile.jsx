import React, { Component } from "react";
import moment from "moment";
import { Link } from "react-router-dom";
import Account from "./account";

export default class Profile extends Component {
  render() {
    const model = this.props.model;
    return (
      <div>
        <ul className="list-group ">
          <li className="list-group-item active">{model.grade}</li>
          <li className="list-group-item">
            {model.userName}
            <span className="float-right">
              <Link to="/pay" className="btn btn-primary">
                充值
              </Link>
            </span>
          </li>
          <li className="list-group-item">
            到期日期 : {moment(model.expiredDate).format("YYYY-MM-DD")}
          </li>
        </ul>
        <Account balance={model.balance} >
          <div>账单</div>
        </Account>
      </div>
    );
  }
}
