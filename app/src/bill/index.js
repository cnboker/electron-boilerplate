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
    this.state = {
      wxqr: ""
    };
  }

  pagination = data => {
    this.terms = Object.assign({}, this.terms, { page: data.selected });
    console.log("pagination", this.terms);
    this.query();
  };

  componentDidMount() {}

  query(terms) {
    this.terms = Object.assign({}, this.terms, terms || {});
    console.log("query", this.terms);
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
  getType(value) {
    if (value == 1 || value == undefined) {
      return "充值";
    } else if (value == 2) {
      return "奖励";
    } else {
      return "-";
    }
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
          that.props.billPay(id);
        })
      ],
     
    });
  }

  qrView(item, e) {
    e.preventDefault();
    var dialog = this.refs.dialog;
    if (!item.wxpayUrl) {
      this.props.wxqr(item._id, item.user);

      (function waitFor(self,id) {
        var _item = self.props.bills.docs[id]
        if (_item && _item.wxpayUrl) {
          showDialog(dialog,_item.wxpayUrl)
          return;
        }
        setTimeout(waitFor, 500, self, id);
      })(this, item._id);

    } else {
      showDialog(dialog,item.wxpayUrl)
    }

    function showDialog(dialog, url){
      dialog.show({
        body: <img src={process.env.REACT_APP_AUTH_URL + url} style={{"height":"180px"}} />,
        actions: [
          Dialog.CancelAction(() => {
            console.log("dialog cancel");
          })
        ],
      });
    }
  }

  userNameRender(item) {
    if (item.payType == 2) {
      return (
        <a href="#" onClick={this.qrView.bind(this, item)}>
          {item.user}
        </a>
      );
    }
    return <span>{item.user}</span>;
  }

  renderList() {
    return Object.keys(this.props.bills.docs)
      .map(x => this.props.bills.docs[x])
      .map(item => {
        return (
          <tr key={item._id}>
            <td>{this.userNameRender(item)}</td>
            <td>{this.getType(item.payType)}</td>
            <td style={{ textAlign: "right" }}>{item.amount.toFixed(2)}</td>
            <td>{this.stringFormatTime(item.createDate)}</td>
            <td>{this.stringFormatTime(item.updateDate)}</td>
            <td>{moment(item.serviceDate).format("YYYY-MM-DD HH:mm")}</td>
            <td>{this.getStatus(item.status)}</td>
            <td>{item.remark}</td>
            <td>
              {item.payType == 2 && item.status === 0 && (
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
          <table className="table table-bordered table-striped table-sm">
            <thead>
              <tr>
                <th>用户</th>
                <th>类型</th>
                <th>金额</th>
                <th>生成日期</th>
                <td>付款日期</td>
                <td>生效日期</td>
                <th>状态</th>
                <th>备注</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>{this.renderList()}</tbody>
          </table>

          <div className="float-right">
            <ReactPaginate
              previousLabel={"上一页"}
              nextLabel={"下一页"}
              breakLabel={<span> ...</span>}
              breakClassName={"break-me"}
              pageCount={this.props.bills.pages}
              marginPagesDisplayed={2}
              pageRangeDisplayed={5}
              onPageChange={this.pagination}
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
