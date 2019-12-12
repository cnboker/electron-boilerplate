import React from "react";
import moment from 'moment'
import Dialog from "~/src/Components/Modals/Dialog";
import Pager from "~/src/Components/Tables/Pager";
import {toast} from "react-toastify";
import {getStatus} from './contants'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faTrash, faCheckCircle} from '@fortawesome/free-solid-svg-icons'

export default class AdminList extends React.Component {

  onConfirm(payno) {
    var self = this;
    this
      .refs
      .dialog
      .show({
        title: "提示",
        body: "确定已收款?",
        actions: [
          Dialog.CancelAction(() => {
            console.log("dialog cancel");
          }),
          Dialog.OKAction(() => {
            self
              .props
              .confirmPay(payno);
          })
        ],
   
      });
  }

  onCancel(payno) {
    var self = this;
    this
      .refs
      .dialog
      .show({
        title: "提示",
        body: "确定要取消此项吗?",
        actions: [
          Dialog.CancelAction(() => {
            console.log("dialog cancel");
          }),
          Dialog.OKAction(() => {
            self
              .props
              .cancelPay(payno);
          })
        ],
  
      });
  }

  renderTR(item, key) {
    return (
      <tr key={key}>
        <td>{item.payNo}</td>
        <td>{item.payUser}</td>
        <td>{item.payCode}</td>
        <td>{item.keeper}</td>
        <td>{item.createDate
            ? moment(item.createDate).format('YYYY-MM-DD')
            : '-'}</td>
        <td>{item.payDate
            ? moment(item.payDate).format('YYYY-MM-DD')
            : '-'}</td>
        <td>{item.confirmDate
            ? moment(item.confirmDate).format('YYYY-MM-DD')
            : '-'}</td>
        <td>{getStatus(item.status)}</td>
        <td>
          <span>
            {(item.status === 0 ||item.status === 1) &&<button
            title = "确认收款"
            className = "btn btn-primary btn-sm"
            onClick = {
              this
                .onConfirm.bind(this, item.payNo)
            } > <FontAwesomeIcon icon={faCheckCircle} size='1x'/> </button>}{' '}</span>
          <span>
            {(item.status === 0 || item.status === 1) &&<button
            title = "取消"
            className = "btn btn-danger btn-sm"
            onClick = {
              this
                .onCancel.bind(this,item.payNo)
            } > <FontAwesomeIcon icon={faTrash} size='1x'/> </button>}</span>
        </td>
      </tr>
    )
  }

  render() {
    return (
      <div className="row">
        <Dialog ref={"dialog"}/>
        <div className="table-responsive">
          <br/>
          <table className="table table-bordered table-striped table-sm">
            <thead>
              <tr>
                <th>编号</th>
                <th>
                  付款用户
                </th>
                <th>附加码</th>
                <th>收款人</th>
                <th>创建日期</th>
                <th>付款日期</th>
                <th>确认日期</th>
                <th>状态</th>
                <th/>
              </tr>
            </thead>
            <tbody>
              {this
                .props
                .data
                .map((x, index) => {
                  return (this.renderTR(x, index));
                })}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

}