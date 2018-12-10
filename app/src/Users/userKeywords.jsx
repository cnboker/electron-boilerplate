import React, {Component} from "react";
import {Link} from "react-router-dom";
import {connect} from "react-redux";
import Dialog from "../Components/Modals/Dialog";
import moment from "moment";
import "../utils/groupBy";
import Select from "react-select";
import {default as crudActions} from "../Keyword/actions";

class List extends Component {
  constructor() {
    super();
    this.state = {
      filter: null
    };
  }

  componentWillMount() {
    this.state = {
      id: this.props.match.params.id
    };

    this.load();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps == undefined) {
      return false;
    }

    /**
     * new Project in town ?
     */
    if (this.state.id != this.props.match.params.id) {
      this.load();
      this.setState({id: this.props.match.params.id});
    }
  }

  load() {
    if (this.props.match.params.id === "__today__") {
      this.today();
    } else {
      this.fetch();
    }
  }
  fetch() {
    const action = crudActions.fetch(0, 0, true, this.props.client, this.props.match.params.id);
    this.dispatch(action);
  }

  today() {
    const action = crudActions.today(0, 0, true, this.props.client);
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
        return "120+";
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

  statusFormat(value) {
    if (value == 1) 
      return "运行";
    if (value == 2) 
      return "停止";
    return "未知";
  }

  toggleSwitch(item, e) {
    var entity = {
      ...item,
      ...{
        status: item.status == 1
          ? 2
          : 1
      }
    };
    console.log("entity", entity);
    var action = actions.update(entity, this.props.client);
    this
      .props
      .dispatch(action);
  }
  getDiff(item) {
    let color = "green",
      diffText = "-";
    if (item.dynamicRank === 0 || item.originRank === 0 || item.dynamicRank === -1) {
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
    return <span style={{
      color: color,
      fontWeight: "bold"
    }}>{diffText}</span>;
  }
  dateDuration(date) {
    return moment().diff(moment(date), 'days')
  }
  renderList() {
    var self = this;
    return this
      .props
      .keywords
      .filter(item => {
        return self.state.filter == null
          ? true
          : item.link == self.state.filter.value;
      })
      .map(item => {
        return (
          <tr key={item._id}>
            <td
              style={{
              overflow: 'hidden',
              'whiteSpace': 'initial'
            }}>{item.keyword}</td>
            <td>{item.link}</td>
            <td>{this.stringFormat(item.originRank)}</td>
            <td>{this.stringFormat(item.dynamicRank)}</td>
            <td>{this.getDiff(item)}</td>
            <td>{this.stringFormat(item.polishedCount)}</td>
            <td>{this.stringFormat(item.isValid)}</td>
            <td>{this.dateDuration(item.createDate)}</td>
            <td>{this.statusFormat(item.status)}</td>
            <td>
              <button
                className="btn btn-danger"
                onClick={this
                .onDelete
                .bind(this, item)}>
                <i className="fa fa-trash"/>
              </button>
            </td>
          </tr>
        );
      });
  }

  onSelect(selectedOption) {
    this.setState({filter: selectedOption});
    console.log("option select", selectedOption);
  }

 
  render() {
    const options = Object
      .keys(this.props.keywords.groupBy("link"))
      .map(item => {
        return {value: item, label: item};
      });
    return (
      <div className="animated fadeIn">
        <Dialog ref="dialog"/>

        <div className="d-flex justify-content-between">
          <div className="col-md-6">
            <Select
              placeholder="域名过滤"
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
              this.props.history.goBack()
            }}
              role="button"
              className="btn btn-primary">
              返回
            </button>{' '}
            <button
              onClick={() => {
              this.load();
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
                <th style={{
                  width: '18%'
                }}>关键词</th>
                <th style={{width:'18%'}}>匹配网址</th>
                <th>始排名</th>
                <th>新排名</th>
                <th>差异</th>
                <th>点击</th>
                <th>有效</th>
                <th>天数</th>
                <th>状态</th>
                <th/>
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
  return {keywords: state.keywords, client: state.client};
};
//state表示reducer, combineReducer包含state和dispatch
export default connect(mapStateToProps)(List);
