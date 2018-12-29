import React, {Component} from "react";
import moment from "moment";
import {Link} from "react-router-dom";

export default class Profile extends Component {
  getFeeType(val) {
    if (val == undefined || val === 1) 
      return '充值'
    if (val === 2) 
      return '佣金'
    return '未知'
  }

  getStatus(item) {
    var val = item.status;
    if (val === 0) 
      return '未付款'
    if (val == undefined || val === 1) {
      if(item.payType == 2){
        return '已收款'
      }else{
        return '已付款'
      }
    }
   
    return '未知'
  }

  renderList() {
    return this
      .props
      .model
      .balance
      .map(item => {
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
          <li className="list-group-item">{model.userName}
            <span className="float-right">
              <Link to="/sn/snActive" className="btn btn-primary">充值</Link>
            </span>
          </li>
          <li className="list-group-item">
            到期日期 :{" "} {moment(model.expiredDate).format("YYYY-MM-DD")}
          </li>
        </ul>
        <p/>
        <div className="table-responsive">
          <table className="table table-bordered table-striped">
            <thead>
              <tr>
                <th>费用类型</th>
                <th>充值金额</th>
                <th>充值日期</th>
                <th>到期日期</th>
                <td>状态</td>
              </tr>
            </thead>
            <tbody>{this.renderList()}</tbody>
          </table>
        </div>
      </div>
    );
  }
}
