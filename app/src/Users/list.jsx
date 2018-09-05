import {default as crudActions} from "./actions";
import React, {Component} from "react";
import {Link} from "react-router-dom";
import {connect} from "react-redux";
import Dialog from "../Components/Modals/Dialog";
import moment from "moment";
import {Switch} from "../Components/Forms/Switch";
import Select from 'react-select'
import {PAGE_SIZE} from './constants'
class List extends Component {
  constructor() {
    super();
    this.state = {
      filter: null,
      pageIndex:1
    };
  }
  componentDidMount() {
    //mock()
    this.fetch();
  }

  fetch() {
    const action = crudActions.fetch(this.state.pageIndex, PAGE_SIZE, true, this.props.client);
    this.dispatch(action);
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

  stringFormatTime(val){
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

  toggleSwitch(item, e) {
    var entity = {
      ...item,      
        status: item.status       
    };
    console.log("entity", entity);
    var action = actions.update(entity, this.props.client);
    this
      .props
      .dispatch(action);
  }

  renderList() {
    var self = this;
    return this
      .props
      .users
      .filter(item => {
        return self.state.filter == null
          ? true
          : item.isOnline === !!self.state.filter.value;
      })
      .map(item => {
        return (
          <tr key={item._id}>
            <td>{item.userName}</td>
            <td>{item.email}</td>
            <td>
              <Link to={`/users/keywords/${item.userName}`} role="button" className="btn btn-success">
                {this.stringFormat(item.keywordCount)}
              </Link>

            </td>
            <td>{this.stringFormatTime(item.lastLoginDate)}</td>
            <td>{this.stringFormat(item.isOnline)}</td>
            <td>{item.userTypeText}</td>
            <td>{this.statusFormat(item.expiredDate)}</td>
            <td>{this.statusFormat(item.totalPoint)}</td>
          </tr>
        );
      });
  }

  onSelect(selectedOption) {
    this.setState({filter: selectedOption});
    console.log('option select', selectedOption)
  }

  render() {
    const options = [
      {
        value: 1,
        label: '在线'
      },
      {
        value: 0,
        label: '离线'
      }
    ]
    return (
      <div className="animated fadeIn">
        <Dialog ref="dialog"/>

        <div className="d-flex justify-content-between">
          <div className="col-md-6">
            <Select
              placeholder="用户状态"
              value={this.state.filter}
              onChange={this
              .onSelect
              .bind(this)}
              options={options}
              id="filter"/>{" "}
          </div>
          <div>

            <button
              onClick={() => {
              this.fetch();
            }}
              role="button"
              className="btn btn-info">
              刷新
            </button>
          </div>

        </div>

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
              </tr>
            </thead>
            <tbody>{this.renderList()}</tbody>
          </table>
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
