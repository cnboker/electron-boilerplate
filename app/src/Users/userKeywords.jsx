import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import Dialog from "../Components/Modals/Dialog";
import moment from "moment";
import "../utils/groupBy";
import Select from 'react-select'
import { default as crudActions } from "../Keyword/actions";

class List extends Component {
  constructor() {
    super();
    this.state = {
      filter: null
    };
  }
  componentDidMount() {
    //mock()
    console.log('this.props.match.params.id ',this.props.match.params.id )
    if(this.props.match.params.id === '__today__'){
      this.today();
    }else{
      this.fetch();

    }
  }

  fetch() {
    const action = crudActions.fetch(0, 0, true, this.props.client,this.props.match.params.id);
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
    var action = actions.update(entity, this.props.client);
    this.props.dispatch(action);
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
            <td>{item.keyword}</td>
            <td>{item.link}</td>
            <td>{this.stringFormat(item.originRank)}</td>
            <td>{this.stringFormat(item.dynamicRank)}</td>
            <td>{this.stringFormat(item.polishedCount)}</td>
            <td>{this.stringFormat(item.isValid)}</td>
            <td>{this.stringFormat(item.createDate)}</td>
            <td>{this.statusFormat(item.status)}</td>          
            <td>
           
              <button
                className="btn btn-danger"
                onClick={this.onDelete.bind(this, item)}
              >
                <i className="fa fa-trash" />
              </button>
            
            </td>
          </tr>
        );
      });
  }

  onSelect(selectedOption) {
    this.setState({
      filter: selectedOption
    });
    console.log('option select', selectedOption)
  }

  render() {
    const options = Object.keys(this.props.keywords.groupBy('link')).map((item)=>{
      return {
        value:item, label:item
      }
    })
    return (
      <div className="animated fadeIn">
        <Dialog ref="dialog" />

        <div className="d-flex justify-content-between">
           <div className="col-md-6">          
           <Select placeholder="域名过滤" value={this.state.filter} onChange={this.onSelect.bind(this)} options={options} id="filter"/>{" "}
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
            <br/>
          <table className="table table-bordered table-striped">
            <thead>
              <tr>
                <th>关键字</th>
                <th>匹配链接</th>
                <th>原始排名</th>
                <th>最新排名</th>
                <th>擦亮次数</th>
                <th>是否有效</th>
                <th>创建日期</th>
                <th>状态</th>
          
                <th />
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
  return { keywords: state.keywords, client: state.client };
};
//state表示reducer, combineReducer包含state和dispatch
export default connect(mapStateToProps)(List);
