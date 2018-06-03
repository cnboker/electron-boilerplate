import { default as crudActions } from "./actions"
import React, { Component } from "react"
import { Link } from "react-router-dom"
import { connect } from "react-redux"
//import mock from './mocks'
import { Navbar, Nav } from "react-bootstrap"
import Dialog from "../Components/Modals/Dialog"
import moment from "moment"

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
    this.refs.dialog.showAlert('Hello!')
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
    if (val == undefined) return '-';
    if (val === true) return '是';
    if (val === false) return '否';
    if(Number.isInteger(val)) return val;
    if (this.isValidDate(val)) {
      return moment(val).format("YYYY-MM-DD")
    }
    return val;
  }

  isValidDate(value) {
    var dateWrapper = new Date(value);
    return !isNaN(dateWrapper.getDate());
  }

  renderList() {
    return this
      .props
      .keywords
      .map(item => {
        return (
          <tr key={item._id}>
            <td>
              {item.engine}
            </td>
            <td>
              {item.keyword}
            </td>
            <td>{item.link}</td>
            <td>{this.stringFormat(item.originRank)}</td>
            <td>{this.stringFormat(item.dynamicRank)}</td>
            <td>{this.stringFormat(item.polishedCount)}</td>
            <td>{this.stringFormat(item.todayPolished)}</td>
            <td>{this.stringFormat(item.isValid)}</td>
            <td>
              {this.stringFormat(item.lastPolishedDate)}
            </td>
            <td>
              {this.stringFormat(item.createDate)}
            </td>
            <td>
              <Link to={`/keyword/${item._id}`} role="button" className="btn btn-success">
                <i className="fa fa-pencil fa-lg" />
              </Link>&nbsp;

              <button
                className="btn btn-danger"
                onClick={this
                  .onDelete
                  .bind(this, item)}>
                <i className="fa fa-trash" />
              </button>
            </td>
          </tr>
        )
      })
  }

  render() {

    return (
      <div className="animated fadeIn">

        <Dialog ref="dialog" />
        <div className="mb-3">
          <Link to={"/keyword/new"} role="button" className="btn btn-success">
            新建
          </Link>
        </div>

        <div className="table-responsive">
          <table className="table table-bordered table-striped">
            <thead>
              <tr>
                <th>搜索引擎</th>
                <th>关键字</th>
                <th>匹配链接</th>
                <th>原始排名</th>
                <th>最新排名</th>
                <th>擦亮次数</th>
                <th>今天是否擦亮</th>
                <th>是否有效</th>
                <th>上次擦亮时间</th>
                <th>创建日期</th>
                <th />
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
  return {
    keywords: state.keywords,
    client: state.client
  }
}
//state表示reducer, combineReducer包含state和dispatch
export default connect(mapStateToProps)(List)
