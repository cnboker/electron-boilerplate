import React, { Component } from "react";
import { connect } from "react-redux";
import moment from "moment";
import Select from "react-select";
import { taskStatusList } from "./constants";
import axios from "axios";
import { timeDuration } from "../utils/string";
import Query from "./listQuery";

class List extends Component {
  constructor() {
    super();
    this.filter = taskStatusList[0];
    this.state = {
      data: {
        clickCount: 0,
        downCount: 0,
        upCount: 0,
        normalCount: 0,
        onlineUserCount: 0,
        keywords: [],
        users: []
      },
      tableData: []
    };
  }

  componentDidMount() {
    this.fetch();
  }

  fetch() {
    const url = `${process.env.REACT_APP_API_URL}/pool/taskPool`;
    console.log("actionCreators url", url);
    var self = this;
    axios({
      url: url,
      method: "get",
      headers: {
        Authorization: `Bearer ${this.props.client.access_token}`
      }
    })
      .then(response => {
        self.setState({
          data: response.data,
          tableData: response.data.keywords
        });
      })
      .catch(e => {
        console.log(e);
      });
  }

  query(terms) {
    var keywords = this.state.data.keywords;
    if (terms.name) {
      keywords = keywords.filter(x => x.user.includes(terms.name));
    }
    if (terms.status != -1) {
      keywords = keywords.filter(x => x.polishStatus === terms.status);
    }
    this.setState({ tableData: keywords });
  }

  isVIP(val) {
    if (val == undefined) return "-";
    if (val === true) return "是";
    if (val === false) return "否";
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

  getUserStatus(val) {
    if (val === 1) return "在线";
    if (val === 0) return "离线";
  }

  getPolishDetail(list) {
    if (list === undefined) return null;
    return list.map((x, index) => {
      return <span key={index}>{x + "|"}</span>;
    });
  }

  taskStatus(val) {
    if (val === 0) return "在运行";
    if (val === 1) return "过量停止";
    if (val === 2) return "排名升停止";
    if (val === 3) return "排名降停止";
    if (val === 4) return "离线停止";
    if (val === 5) return "首页停止";
  }

  getTime(val) {
    if (val === "" || !val) return "";
    return moment(val).format("HH:mm");
  }

  renderList() {
    return this.state.tableData.map((item, index) => {
      return (
        <tr key={index}>
          <td>{index}</td>
          <td style={{ overflow: "hidden", whiteSpace: "initial" }}>
            {item.keyword}
          </td>
          <td>{item.link}</td>
          <td>{item.user}</td>
          <td>{this.getUserStatus(item.status)}</td>

          <td>{this.stringFormat(item.polishedCount)}</td>
          <td>{item.resultIndexer}</td>
          <td>{this.stringFormat(item.dayMaxPolishCount)}</td>
          <td>{item.polishList ? item.polishList.length : 0}</td>
          <td>{this.stringFormat(item.originRank)}</td>
          <td>{this.stringFormat(item.dynamicRank)}</td>
          <td>{this.getPolishDetail(item.polishList)}</td>
          <td>{item.tasker}</td>
          <td>{this.stringFormat(item.update)}</td>
          <td>{this.taskStatus(item.polishStatus)}</td>
        </tr>
      );
    });
  }

  render() {
    return (
      <div className="animated fadeIn">
        <div className="d-flex justify-content-between">
          <div className="col-md-5">
            <span>当日点击量:{this.state.data.clickCount},</span>
            <span>排名上升:{this.state.data.upCount},</span>
            <span>排名下降:{this.state.data.downCount},</span>
            <span>正常:{this.state.data.normalCount},</span>
            <span>在线用户:{this.state.data.onlineUserCount}</span>
          </div>
          <div className="col-md-5">
            <Query query={this.query.bind(this)} />
          </div>
          <div className="col-md-2">
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

        <div
          className="table-responsive tableFixHead"
          style={{ overflow: "scroll", height: "700px" }}
        >
          <br />
          <table className="table table-bordered table-striped   table-sm">
            <thead>
              <tr>
                <th />
                <th style={{ width: "18%" }}>关键词</th>
                <th>链接</th>
                <th>用户</th>
                <th>用户状态</th>

                <th>点击总量</th>
                <th>词量</th>
                <th>今最大量</th>
                <th>今量</th>
                <th>初始排名</th>
                <th>最新排名</th>
                <th>今明细</th>
                <th>执行人</th>
                <th>更新日期</th>
                <th>任务状态</th>
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
