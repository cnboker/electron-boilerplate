import {default as crudActions} from "./actions"
import React, {Component} from "react"
import {Link} from "react-router-dom"
import {connect} from "react-redux"
//import mock from './mocks'
import {Navbar, Nav} from "react-bootstrap"
import Dialog from "../Components/Modals/Dialog"
import moment from "moment"
import {Switch} from '../Components/Forms/Switch'
import axios from 'axios'
import {toast} from 'react-toastify';
import actions from './actions'

class List extends Component {
  componentDidMount() {
    //mock()
    this.fetch()
  }

  fetch() {
    const action = crudActions.fetch(0, 0, true, this.props.client)
    this.dispatch(action)
  }

  get dispatch() {
    return this.props.dispatch
  }

  onDelete(entity, event) {
    event.preventDefault()

    this
      .refs
      .dialog
      .show({
        title: "提示",
        body: "确定要删除此项吗?",
        actions: [
          Dialog.CancelAction(() => {
            console.log("dialog cancel")
          }),
          Dialog.OKAction(() => {
            const action = crudActions.delete(entity, this.props.client)
            this.dispatch(action)
          })
        ],
        bsSize: "small",
        onHide: dialog => {
          dialog.hide()
        }
      })
  }

  stringFormat(val) {
    if (val == undefined) 
      return '-';
    if (val === true) 
      return '是';
    if (val === false) 
      return '否';
    if (Number.isInteger(val)) {
      if (val == -1) 
        return '100+'
      return val;
    }
    if (this.isValidDate(val)) {
      return moment(val).format("YYYY-MM-DD")
    }
    return val;
  }

  isValidDate(value) {
    var dateWrapper = new Date(value);
    return !isNaN(dateWrapper.getDate());
  }

  statusFormat(value) {
    if (value == 1) 
      return '在运行'
    if (value == 2) 
      return '已停止'
    return '未知'
  }

  toggleSwitch(item, e) {
    var entity = {
      ...item,
      ...{status: (item.status == 1
        ? 2
        : 1)}
    }
    console.log('entity',entity)
    var action = actions.update(entity, this.props.client)
    this
      .props
      .dispatch(action)
  }

  renderList() {
    return this
      .props
      .keywords
      .map(item => {
        return (
          <tr key={item._id}>

            <td>
              {item.keyword}
            </td>
            <td>{item.link}</td>
            <td>{this.stringFormat(item.originRank)}</td>
            <td>{this.stringFormat(item.dynamicRank)}</td>
            <td>{this.stringFormat(item.polishedCount)}</td>
            <td>{this.stringFormat(item.isValid)}</td>
            <td>{this.statusFormat(item.status)}</td>
            <td>
              {this.stringFormat(item.lastPolishedDate)}
            </td>
            <td>
              {this.stringFormat(item.createDate)}
            </td>
            <td>
              <Link to={`/keyword/${item._id}`} role="button" className="btn btn-success">
                <i className="fa fa-pencil fa-lg"/>
              </Link>&nbsp;

              <button
                className="btn btn-danger"
                onClick={this
                .onDelete
                .bind(this, item)}>
                <i className="fa fa-trash"/>
              </button>&nbsp;

              <Switch
                on={item.status == 1}
                onClick={this
                .toggleSwitch
                .bind(this, item)}></Switch>

            </td>
          </tr>
        )
      })
  }

  render() {

    return (
      <div className="animated fadeIn">

        <Dialog ref="dialog"/>
        <div className="mb-3">
          <Link to={"/keyword/new"} role="button" className="btn btn-success">
            新建
          </Link>
          <a
            onClick={() => {
            this.fetch();
          }}
            role="button"
            className="btn btn-info pull-right">
            刷新
          </a>
        </div>

        <div className="table-responsive">
          <table className="table table-bordered table-striped">
            <thead>
              <tr>
                <th>关键字</th>
                <th>匹配链接</th>
                <th>原始排名</th>
                <th>最新排名</th>
                <th>擦亮次数</th>
                <th>是否有效</th>
                <th>状态</th>
                <th>上次擦亮时间</th>
                <th>创建日期</th>
                <th/>
              </tr>
            </thead>
            <tbody>
              {this.renderList()}
            </tbody>
          </table>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {keywords: state.keywords, client: state.client}
}
//state表示reducer, combineReducer包含state和dispatch
export default connect(mapStateToProps)(List)
