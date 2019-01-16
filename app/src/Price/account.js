import React, { Component } from "react";
import moment from "moment";

export default class Account extends Component {
  getFeeType(val) {
    if (val == undefined || val === 1) return "充值";
    if (val === 2) return "奖励";
    return "未知";
  }

  getStatus(item) {
    var val = item.status;
    if (val === 0) return "未付款";
    if (val == undefined || val === 1) {
      if (item.payType == 2) {
        return "已收款";
      } else {
        return "已付款";
      }
    }

    return "未知";
  }

  renderList() {
    return this.props.balance.map(item => {
      return (
        <tr key={item._id}>
          <td>{this.getFeeType(item.payType)}</td>
          <td>{(item.amount || 0).toFixed(2)}</td>
          <td>{moment(item.createDate).format("YYYY-MM-DD HH:mm")}</td>
          <td>
            {moment(item.serviceDate)
              .add(item.days, "days")
              .format("YYYY-MM-DD")}
          </td>
          <td>{this.getStatus(item)}</td>
          <td>{item.remark}</td>
        </tr>
      );
    });
  }

  render() {
    return (
      <div className="bd-example">
        <p>账单</p>
        <div className="table-responsive">
          <table className="table table-bordered table-striped">
            <thead>
              <tr>
                <th>费用类型</th>
                <th>金额</th>
                <th>创建日期</th>
                <th>到期/付款日期</th>
                <td>状态</td>
                <td>备注</td>
              </tr>
            </thead>
            <tbody>{this.renderList()}</tbody>
          </table>
        </div>
      </div>
    );
  }
}
