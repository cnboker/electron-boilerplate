import { default as crudActions } from "./actions";
import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import Dialog from "../Components/Modals/Dialog";
import moment from "moment";
import { Switch } from "../Components/Forms/Switch";
import "../utils/groupBy";
import Select from "react-select";
import { Animated } from "react-animated-css";
import { showLoading, hideLoading } from "react-redux-loading-bar";

class List extends Component {
  constructor() {
    super();
    this.state = {
      filter: null
    };
  }
  componentDidMount() {
    //mock()
    this.fetch();
  }

  componentWillUpdate(nextProps, nextState) {}

  fetch() {
    const action = crudActions.fetch(0, 0, true, this.props.client);
    this.dispatch(action);
  }

  get dispatch() {
    return this.props.dispatch;
  }

  onReset(entity,event){
    event.preventDefault();
    this.refs.dialog.show({
      title: "提示",
      body: "确定要重置此项吗?",
      actions: [
        Dialog.CancelAction(() => {
          console.log("dialog cancel");
        }),
        Dialog.OKAction(() => {
          entity.action = 'reset';
          const action = crudActions.update(entity, this.props.client);
          this.dispatch(action);
        })
      ],
      bsSize: "small",
      onHide: dialog => {
        dialog.hide();
      }
    });
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
      bsSize: "small",
      onHide: dialog => {
        dialog.hide();
      }
    });
  }

  stringFormat(val) {
    if (val == undefined) return "-";
    if (val === true) return "是";
    if (val === false) return "否";
    if (Number.isInteger(val)) {
      if (val == -1) return "120+";
      return val;
    }
    if (this.isValidDate(val)) {
      return moment(val).format("YYYY-MM-DD");
    }
    return val;
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

  toggleSwitch(item, e) {
    var entity = {
      ...item,
      ...{
        status: item.status == 1 ? 2 : 1
      }
    };
    console.log("entity", entity);
    var action = crudActions.update(entity, this.props.client);
    this.props.dispatch(action);
  }
  getDiff(item) {
    let color = "green",
      diffText = "-";
    if (
      item.dynamicRank === 0 ||
      item.originRank === 0 ||
      item.dynamicRank === -1
    ) {
      color = "black";
    } else {
      var diff = item.originRank - item.dynamicRank;
      if (diff > 0) {
        diffText = "+" + diff;
      } else if (diff === 0) {
        color = "black";
        diffText = diff;
      } else {
        color = "red";
        diffText = diff;
      }
    }
    return <span style={{ color: color, fontWeight: "bold" }}>{diffText}</span>;
  }

  getFire(item){
    if(item.adIndexer == undefined)return <span>-</span>
    var indexer = item.adIndexer ;
    if(indexer > 0){
      return [...Array(item.adIndexer)].map((e,i)=>{
        return <i className="fa fa-diamond " style={{color:'red'}}/>
      })
    }else{
      return  <span>0</span>
    }
  }
  renderList() {
    var self = this;
    return this.props.keywords
      .filter(item => {
        return self.state.filter == null
          ? true
          : item.link == self.state.filter.value;
      })
      .map(item => {
        return (
          <tr key={item._id}>
            <td style={{ overflow: "hidden", whiteSpace: "initial" }}>
              {item.keyword}
            </td>
            <td>{item.link}</td>
            <td>{this.stringFormat(item.originRank)}</td>
            <td>{this.stringFormat(item.dynamicRank)}</td>
            <td>{this.getDiff(item)}</td>
            <td>
                {
                 this.getFire(item)
                }
            </td>
            <td>{this.stringFormat(item.isValid && item.shield != 1)}</td>
            <td>{this.statusFormat(item.status)}</td>
            {/*}
            <td>
              {this.stringFormat(item.lastPolishedDate)}
            </td>
            <td>
              {this.stringFormat(item.createDate)}
            </td>
        */}
            <td>
              <Link title="排名历史"
                to={`/analysis/${item._id}`}
                role="button"
                className="btn btn-info btn-sm"
              >
                <i className="fa fa-signal fa-small" />
                {/*  https://fontawesome.com/v4.7.0/icons/ */}
              </Link>
            </td>
            <td>
              <button title="删除"
                className="btn btn-danger btn-sm"
                onClick={this.onDelete.bind(this, item)}
              >
                <i className="fa fa-trash" />
              </button>{" "}
              <button title="重置"
                className="btn btn-warning btn-sm"
                onClick={this.onReset.bind(this, item)}
              >
                <i className="fa fa-undo" />
              </button>{" "}
              <Switch
                on={item.status == 1}
                onClick={this.toggleSwitch.bind(this, item)}
              />
             
            
            </td>
          </tr>
        );
      });
  }

  onSelect(selectedOption) {
    this.setState({
      filter: selectedOption
    });
    console.log("option select", selectedOption);
  }

  render() {
    const options = Object.keys(this.props.keywords.groupBy("link")).map(
      item => {
        return {
          value: item,
          label: item
        };
      }
    );
    return (
      <div className="animated fadeIn">
        <Dialog ref="dialog" />
        <div className="row">
          <div className="col-md-12">
            <Animated className="animated flash  " isVisible={true}>
              <div id="__messages" className="alert alert-success">
                保持程序运行，优化工作正在进行中...
              </div>
              {this.props.keywords.filter(e => {
                return e.shield == 1;
              }).length > 0 && (
                <div className="alert alert-danger">
                  VIP会员资格已过期, 快去<Link to="/sn/snActive">升级</Link>吧!
                </div>
              )}
            </Animated>
          </div>
        </div>
        <div className="d-flex justify-content-between">
          <div className="col-md-6">
            <Select
              placeholder="域名过滤"
              value={this.state.filter}
              onChange={this.onSelect.bind(this)}
              options={options}
              id="filter"
            />{" "}
          </div>
          <div>
            <Link to={"/keyword/new"} role="button" className="btn btn-success">
              新建
            </Link>{" "}
            <button
              id="pageRefresh"
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
          <table className="table table-bordered table-striped table-sm">
            <thead>
              <tr>
                <th
                  style={{
                    width: "22%",
                    overflow: "hidden",
                    textOverflow: "ellipsis"
                  }}
                >
                  关键词
                </th>
                <th>匹配网址</th>
                <th>初始排名</th>
                <th>最新排名</th>
                <th>变化</th>
                <th>商业热度</th>
                <th>有效</th>
                <th>状态</th>
                <th>跟踪</th>
               
                {/*<th>上次擦亮时间</th>
                <th>创建日期</th>*/}
                <th />
              </tr>
            </thead>
            <tbody>{this.renderList()}</tbody>
          </table>
          <p>
            注：正常情况下，提交关键字后，约2分钟会出现初始排名数据. <br />
            1.初始排名数据在1~120之间，则表明系统正常运行，将软件最小化即可.{" "}
            <br />
            2.
            若较长时间后，初始排名数据仍为0，表明系统未正常启动检测功能。请查看“帮助"
            及时处理. <br />
            3.
            若初始排名数据显示为120+，则表明目标网页排名在12页以后，页面质量较弱，系统停止检测，请查看
            "帮助" 进行针对性解决.
          </p>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return { keywords: state.keywords, client: state.client };
};
//state表示reducer, combineReducer包含state和dispatch
export default connect(mapStateToProps)(List);
