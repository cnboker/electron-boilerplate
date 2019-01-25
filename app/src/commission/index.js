import React, { Component } from "react";
import moment from "moment";
import ReactPaginate from "react-paginate";
import Dialog from "../Components/Modals/Dialog";
import Query from "./query";

const PAGE_SIZE = 30;

class Index extends Component {
  constructor() {
    super();
    this.terms = { limit: PAGE_SIZE, page: 0 };
  }

  pagination = data => {
    this.terms = Object.assign({ page: data.selected }, this.terms);
    this.query();
  };

  componentDidMount() {}

  query(terms) {
    this.terms = Object.assign({}, this.terms, terms || {});

    this.props.fetchAll(this.terms);
  }

  stringFormatTime(val) {
    if (!val) return "";
    return moment(val).format("YYYY-MM-DD HH:mm");
  }

  isValidDate(value) {
    var dateWrapper = new Date(value);
    return !isNaN(dateWrapper.getDate());
  }

  stringBoolean(value) {
    return value ? "是" : "否";
  }

  pay(id) {
    event.preventDefault();
    const that = this;
    this.refs.dialog.show({
      title: "提示",
      body: "确定要付款操作吗?",
      actions: [
        Dialog.CancelAction(() => {
          console.log("dialog cancel");
        }),
        Dialog.OKAction(() => {
          that.props.commissionPay(id);
        })
      ],
      bsSize: "small",
      onHide: dialog => {
        dialog.hide();
      }
    });
  }

  renderList() {
    return Object.keys(this.props.commissions.docs)
      .map(x => this.props.commissions.docs[x])
      .map(item => {
        return (
          <tr key={item._id}>
            <td>{item.user}</td>
            <td style={{ textAlign: "right" }}>{item.amount.toFixed(2)}</td>
            <td>{this.stringFormatTime(item.createDate)}</td>
            <td>{this.stringFormatTime(item.updateDate)}</td>
            <td>{this.getStatus(item.status)}</td>
            <td>{item.remark}</td>
            <td>
              {item.status === 0 && (
                <button
                  className="btn btn-primary"
                  value="付款"
                  onClick={this.pay.bind(this, item._id)}
                >
                  付款
                </button>
              )}
            </td>
          </tr>
        );
      });
  }

  getStatus(val) {
    if (val === 0) return "未付款";
    if (val == undefined || val === 1) return "已付款";
    return "未知";
  }

  render() {
    return (
      <div className="animated fadeIn">
        <Dialog ref="dialog" />
        <div className="d-flex justify-content-between">
          <div className="col-md-6">
            <Query query={this.query.bind(this)} />
          </div>
        </div>
        <br />
        <div className="table-responsive">
          <table className="table table-bordered table-striped">
            <thead>
              <tr>
                <th>推荐人用户</th>
                <th>奖励</th>
                <th>生成日期</th>
                <td>付款日期</td>
                <th>状态</th>
                <th>备注</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>{this.renderList()}</tbody>
          </table>

          <div className="pull-right">
            <ReactPaginate
              previousLabel={"上一页"}
              nextLabel={"下一页"}
              breakLabel={<a href="#"> ...</a>}
              breakClassName={"break-me"}
              pageCount={this.props.commissions.pages}
              marginPagesDisplayed={2}
              pageRangeDisplayed={5}
              onPageChange={this.pagination.bind(this)}
              containerClassName={"pagination"}
              subContainerClassName={"pages pagination"}
              activeClassName={"active"}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default Index;
