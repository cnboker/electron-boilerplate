import React, { Component } from "react";

import moment from "moment";


export default class Profile extends Component {

  renderList() {
    return this.props.model.balance.map(item => {
      return (
        <tr key={item._id}>
          <td>{item.amount}</td>
          <td>{moment(item.createDate).format("YYYY-MM-DD")}</td>
          <td>
            {moment(item.serviceDate)
              .add(item.days, "days")
              .format("YYYY-MM-DD")}
          </td>
        </tr>
      );
    });
  }

  render() {
      const model = this.props.model;
    return (
      <div>
        <ul className="list-group">
          <li className="list-group-item active">{model.grade}</li>
          <li className="list-group-item">{model.userName}</li>
          <li className="list-group-item">
            到期日期 :{" "}
            {moment(model.expiredDate).format("YYYY-MM-DD")}
          </li>
        </ul>
        <p />
        <div className="table-responsive">
          <table className="table table-bordered table-striped">
            <thead>
              <tr>
                <th>充值金额</th>
                <th>充值日期</th>
                <th>到期日期</th>
              </tr>
            </thead>
            <tbody>{this.renderList()}</tbody>
          </table>
        </div>
      </div>
    );
  }
}

