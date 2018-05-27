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

  renderList() {
    return this
      .props
      .keywords
      .map(item => {
        return (
          <tr key={item._id}>
            <td data-title="搜索引擎">
              {item.engine}
            </td>
            <td data-title="关键字">
              {item.keyword}
            </td>
            <td data-title="匹配链接">{item.link}</td>
            <td data-title="排名页数">{item.page}</td>

            <td data-title="上次擦亮时间">
              {item.createDate == undefined ? '' : moment(item.createDate).format("YYYY-MM-DD")}
            </td>

            <td data-title="操作">
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
                <th>排名页数</th>
                <th>上次擦亮时间</th>
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
    client:state.client
   }
}
//state表示reducer, combineReducer包含state和dispatch
export default connect(mapStateToProps)(List)
