import React, { Component } from "react";
import { connect } from "react-redux";
import moment from "moment";
import Select from "react-select";
import { taskStatusList } from "./constants";
import axios from "axios";

class List extends Component {
  constructor() {
    super();
    this.filter = taskStatusList[0];
    this.state = {
      data: []
    };
  }

  componentWillMount() {
    this.fetch();
  }

  fetch() {
    const url = `${process.env.REACT_APP_API_URL}/pool/${this.filter.value}`;
    console.log("actionCreators url", url);
    var self = this;
    axios({
      url: url,
      method: "get",
      headers: {
        Authorization: `Bearer ${this.props.client.token.access_token}`
      }
    })
      .then(response => {
        self.setState({ data: response.data });
      })
      .catch(e => {
        console.log(e);
      });
  }

  stringFormat(val) {
    if (val == undefined) return "-";
    if (val === true) return "是";
    if (val === false) return "否";
    if (Number.isInteger(val)) {
      if (val == -1) return "100+";
      return val;
    }
    if (this.isValidDate(val)) {
      return moment(val).format("YYYY-MM-DD HH:mm");
    }
    return val;
  }

  isValidDate(value) {
    var dateWrapper = new Date(value);
    return !isNaN(dateWrapper.getDate());
  }

  renderList() {
    return this.state.data.map(item => {
      return (
        <tr key={item._id}>
          <td>{item.user}</td>
          <td>{item.keyword}</td>
          <td>{item.link}</td>
          <td>{this.stringFormat(item.originRank)}</td>
          <td>{this.stringFormat(item.dynamicRank)}</td>
          <td>{this.stringFormat(item.polishedCount)}</td>
          <td>{this.stringFormat(item.point)}</td>
          <td>{this.stringFormat(item.tasker)}</td>
          <td>{this.stringFormat(item.createDate)}</td>
        </tr>
      );
    });
  }

  onSelect(selectedOption) {
    this.filter= selectedOption
    console.log(this.filter)
    this.fetch();
  }

  render() {
    return (
      <div className="animated fadeIn">
        <div className="d-flex justify-content-between">
          <div className="col-md-6">
            <Select
              placeholder="任务池"
              value={this.filter}
              onChange={this.onSelect.bind(this)}
              options={taskStatusList}
            />{" "}
          </div>
          <div>
            <button
              onClick={() => {
                this.fetch();
              }}
              role="button"
              className="btn btn-info"
            >
              刷新
            </button>
          </div>
        </div>

        <div className="table-responsive">
          <br />
          <table className="table table-bordered table-striped">
            <thead>
              <tr>
                <th>用户</th>
                <th>关键字</th>
                <th>链接</th>
                <th>原始排名</th>
                <th>最新排名</th>
                <th>擦亮次数</th>
                <th>优币</th>
                <th>执行人</th>
                <th>创建日期</th>
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
  return { client: state.client };
};
//state表示reducer, combineReducer包含state和dispatch
export default connect(mapStateToProps)(List);
