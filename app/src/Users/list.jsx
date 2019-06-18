import { default as crudActions } from "./actions";
import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import Dialog from "../Components/Modals/Dialog";
import moment from "moment";
import { Switch } from "../Components/Forms/Switch";
import { PAGE_SIZE } from "./constants";
import UserQuery from "./listQuery";
import Pager from "../Components/Tables/Pager";
class List extends Component {
  constructor() {
    super();
    this.state = {
      pageCount: 1,
      data: []
    };
  }

  pagination = data => {
    this.terms.page = data.selected;
    this.query();
  };

  query(terms) {
    this.terms = terms || this.terms;
    this.fetch({
      ...this.terms,
      limit: PAGE_SIZE
    });
  }

  fetch(ps) {
    console.log("paramters", ps);

    var self = this;
    crudActions
      .fetch(ps, this.props.client)
      .then(result => {
        self.setState({
          total: result.data.total,
          data: result.data.docs,
          pageCount: result.data.pages
        });
      })
      .catch(e => {
        console.log(e);
      });
  }

  get dispatch() {
    return this.props.dispatch;
  }

  onDelete(entity, event) {
    event.preventDefault();

    this.refs.dialog.show({
      title: "提示",
      body: "确定要删除此项吗?",
      actions: [
        Dialog.CancelAction(() => {
          console.log("dialog cancel");
        }),
        Dialog.OKAction(() => {
          const action = crudActions.delete(entity, this.props.client);
          this.dispatch(action);
        })
      ],

    });
  }
  isOnline(val) {
    if (val === 1) return "是";
    if (val === 0) return "否";
  }

  stringFormat(val) {
    if (val == undefined) return "-";

    if (Number.isInteger(val)) {
      if (val == -1) return "120+";
      return val;
    }
    if (this.isValidDate(val)) {
      return moment(val).format("YYYY-MM-DD");
    }
    return val;
  }

  stringFormatTime(val) {
    if (!val) return "";
    return moment(val).format("HH:mm");
  }

  isValidDate(value) {
    var dateWrapper = new Date(value);
    return !isNaN(dateWrapper.getDate());
  }

  statusFormat(value) {
    if (value == 1) return "在运行";

    if (value == 2) return "已停止";
    return "未知";
  }

  toggleSwitch(user, e) {
    var action = crudActions.update(
      {
        ...user,
        locked: !user.locked
      },
      this.props.client
    );
    user.locked = !user.locked;
    this.props.dispatch(action);
  }

  keeperSwitch(user, e) {
    var action = crudActions.update(
      {
        ...user,
        keeper: !user.keeper
      },
      this.props.client
    );
    user.keeper = !user.keeper;
    this.props.dispatch(action);
  }

  renderList() {
    return this.state.data.map(item => {
      return (
        <tr key={item._id}>
          <td>
            <Switch
              on={item.locked}
              onClick={this.toggleSwitch.bind(this, item)}
            />
          </td>
          <td>
            <Switch
              on={item.keeper}
              onClick={this.keeperSwitch.bind(this, item)}
            />
          </td>
          <td>{item.userName}</td>
          <td>
            <Link to={`/users/keywords/${item.userName}`}>
              {this.stringFormat(item.keywordCount)}
            </Link>
          </td>
          <td>{this.stringFormatTime(item.lastLoginDate)}</td>
          <td>{this.isOnline(item.status)}</td>
          <td>{item.userTypeText}</td>
          <td>{this.stringFormat(item.createDate)}</td>

          <td>{item.point}</td>
          <td>{(item.performanceIndex || 0).toFixed(2)}</td>
          <td>{item.todayPolishedCount || 0}</td>
          <td>{this.stringFormat(item.vipExpiredDate)}</td>
          <td>{item.email}</td>
        </tr>
      );
    });
  }

  render() {
    return (
      <div className="animated fadeIn">
        <Dialog ref="dialog" />
        <p>
          合计:
          {this.state.total}
        </p>
        <UserQuery query={this.query.bind(this)} />

        <div className="table-responsive">
          <br />
          <table className="table table-bordered table-striped  table-sm">
            <thead>
              <tr>
                <th>拉黑</th>
                <th>收款人</th>
                <th>用户名称</th>
                <th>词数</th>
                <th>登录</th>
                <th>在线</th>
                <th>会员类型</th>
                <th>注册日期</th>

                <th>积分</th>
                <th>优化指数</th>
                <th>今点</th>
                <th>到期日期</th>
                <th>邮箱</th>
              </tr>
            </thead>
            <tbody>{this.renderList()}</tbody>
          </table>
          <br />
          <div className="float-right">
            <Pager
              pageCount={this.state.pageCount}
              onPageChange={this.pagination}
            />
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return { users: state.users, client: state.client };
};
//state表示reducer, combineReducer包含state和dispatch
export default connect(mapStateToProps)(List);
