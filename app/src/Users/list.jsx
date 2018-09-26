import {default as crudActions} from "./actions";
import React, {Component} from "react";
import {Link} from "react-router-dom";
import {connect} from "react-redux";
import Dialog from "../Components/Modals/Dialog";
import moment from "moment";
import ReactPaginate from 'react-paginate';
import {Switch} from "../Components/Forms/Switch";
import {PAGE_SIZE} from './constants'
import UserQuery from './listQuery'

class List extends Component {

  constructor() {
    super();
    this.state = {
      pageCount: 1,
      data: [],
      page: 0
    };
  }

  pagination = (data) => {
    let page = data.selected;
    this.setState({page})
    this.fetch();
  }

  query(terms) {
    this.terms = terms;
    this.fetch({
      page: this.state.page,
      limit: PAGE_SIZE,
      ...terms
    })
  }

  fetch(ps) {
    //console.log('paramters',ps)
    var self = this;
    crudActions
      .fetch(ps, this.props.client)
      .then(result => {
        self.setState({data: result.data.docs, pageCount: result.data.pages})
      })
      .catch(e => {
        console.log(e)
      })

  }

  get dispatch() {
    return this.props.dispatch;
  }

  onDelete(entity, event) {
    event.preventDefault();

    this
      .refs
      .dialog
      .show({
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
        bsSize: "small",
        onHide: dialog => {
          dialog.hide();
        }
      });
  }

  stringFormat(val) {
    if (val == undefined) 
      return "-";
    if (val === true) 
      return "是";
    if (val === false) 
      return "否";
    if (Number.isInteger(val)) {
      if (val == -1) 
        return "100+";
      return val;
    }
    if (this.isValidDate(val)) {
      return moment(val).format("YYYY-MM-DD");
    }
    return val;
  }

  stringFormatTime(val) {
    return moment(val).format("MM-DD HH:mm:ss")
  }

  isValidDate(value) {
    var dateWrapper = new Date(value);
    return !isNaN(dateWrapper.getDate());
  }

  statusFormat(value) {
    if (value == 1) 
      return "在运行";
    
    if (value == 2) 
      return "已停止";
    return "未知";
  }

  toggleSwitch(user, e) {
    var action = crudActions.update({
      ...user,
      locked: !user.locked
    }, this.props.client);
    user.locked = !user.locked
    this
      .props
      .dispatch(action);
  }

  renderList() {
    return this
      .state
      .data
      .map(item => {
        return (
          <tr key={item._id}>
            <td>{item.userName}</td>
            <td>{item.email}</td>
            <td>
              <Link to={`/users/keywords/${item.userName}`}>
                {this.stringFormat(item.keywordCount)}
              </Link>

            </td>
            <td>{this.stringFormatTime(item.lastLoginDate)}</td>
            <td>{this.stringFormat(item.isOnline)}</td>
            <td>{item.userTypeText}</td>
            <td>{this.statusFormat(item.expiredDate)}</td>
            <td>{this.statusFormat(item.totalPoint)}</td>
            <td>
              <Switch
                on={item.locked}
                onClick={this
                .toggleSwitch
                .bind(this, item)}/>
            </td>
          </tr>
        );
      });
  }

  render() {

    return (
      <div className="animated fadeIn">
        <Dialog ref="dialog"/>
        <UserQuery query={this
          .query
          .bind(this)}/>

        <div className="table-responsive">
          <br/>
          <table className="table table-bordered table-striped">
            <thead>
              <tr>
                <th>用户名称</th>
                <th>邮箱</th>
                <th>关键字数</th>
                <th>上次登录时间</th>
                <th>是否在线</th>
                <th>会员类型</th>
                <th>到期日期</th>
                <th>积分</th>
                <th>拉黑</th>
              </tr>
            </thead>
            <tbody>{this.renderList()}</tbody>
          </table>
          <br/>
          <div className="pull-right">
            <ReactPaginate
              previousLabel={'上一页'}
              nextLabel={'下一页'}
              breakLabel={< a href = "" > ...</a>}
              breakClassName={"break-me"}
              pageCount={this.state.pageCount}
              marginPagesDisplayed={2}
              pageRangeDisplayed={5}
              onPageChange={this.pagination}
              containerClassName={"pagination"}
              subContainerClassName={"pages pagination"}
              activeClassName={"active"}/>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {users: state.users, client: state.client};
};
//state表示reducer, combineReducer包含state和dispatch
export default connect(mapStateToProps)(List);
