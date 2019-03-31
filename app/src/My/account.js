import React, { Component } from "react";
import moment from "moment";
import { getFeeType, getStatus } from "./contants";
import If from "../lib/If";

export default class Account extends Component {
  renderList() {
    return this.props.balance.map(item => {
      return (
        <tr key={item._id}>
          <td>{getFeeType(item.payType)}</td>
          <td>{(item.amount || 0).toFixed(2)}</td>
          <td>{moment(item.createDate).format("YYYY-MM-DD HH:mm")}</td>
          <td>
            <If test={item.payType === 1 || item.payType == undefined}>
              <span>{moment(item.serviceDate)
                .add(item.days, "days")
                .format("YYYY-MM-DD")}</span>
            </If>
            <If test={item.payType === 2 && item.updateDate!= undefined}>
             <span> {moment(item.updateDate).format("YYYY-MM-DD HH:mm")}</span>
            </If>
          </td>
          <td>{getStatus(item)}</td>
          <td>{item.remark}</td>
        </tr>
      );
    });
  }

  render() {
    return (
      <div className="">
        <div>{this.props.children}</div>
        <div className="table-responsive">
          <table className="table table-bordered table-striped">
            <thead>
              <tr>
                <th>费用类型</th>
                <th>金额</th>
                <th>创建日期</th>
                <th>{this.props.onlyReward?'提现日期':'VIP到期/提现日期'}</th>
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
