import {default as crudActions} from "./actions";
import React, {Component} from "react";
import {Link} from "react-router-dom";
import {connect} from "react-redux";
import moment from "moment";
import ReactPaginate from "react-paginate";
import {PAGE_SIZE} from "./constants";
import Select from "react-select";
import "../utils/groupBy";
import Query from "./listQuery";

class List extends Component {
  constructor() {
    super();
    this.state = {
      pageCount: 1,
      data: [],
      filter: null
    };
    this.page = 0;
    this.terms = {};
  }

  pagination = data => {
    this.page = data.selected;
    this.query();
  }

  componentDidMount() {
    this.query();
  }

  query(terms) {
    this.terms = terms || this.terms;
    this.fetch({
      page: this.page,
      limit: PAGE_SIZE,
      ...this.terms
    });
  }

  fetch(ps) {
    //console.log('paramters',ps)
    var self = this;
    crudActions
      .fetch(ps, this.props.client)
      .then(result => {
        self.setState({total: result.data.total, data: result.data.docs, pageCount: result.data.pages});
        self.options = Object
          .keys(result.data.docs.groupBy("userName"))
          .map(item => {
            return {value: item, label: item};
          });
      })
      .catch(e => {
        console.log(e);
      });
  }

  get dispatch() {
    return this.props.dispatch;
  }

  stringFormat(val) {
    if (val == undefined) 
      return "-";
    
    if (Number.isInteger(val)) {
      if (val == -1) 
        return "120+";
      return val;
    }
    if (this.isValidDate(val)) {
      return moment(val).format("YYYY-MM-DD");
    }
    return val;
  }

  stringFormatTime(val) {
    if (!val) 
      return "";
    return moment(val).format("YYYY-MM-DD HH:mm");
  }

  isValidDate(value) {
    var dateWrapper = new Date(value);
    return !isNaN(dateWrapper.getDate());
  }

  stringBoolean(value) {
    return value
      ? '是'
      : '否';
  }

  onSelect(selectedOption) {
    this.setState({filter: selectedOption});
    this.query({id: selectedOption.value})
  }

  renderList() {

    return this
      .state
      .data
      .map(item => {
        return (
          <tr key={item._id}>
            <td>
              <Link to={`/sn/create/${item.userName}`}>{item.userName}</Link>
            </td>
            <td>{item.sn}</td>
            <td style={{textAlign:'right'}}>{item.agentPrice.toFixed(2)}</td>
            <td>{this.stringFormatTime(item.createDate)}</td>
            <td>{this.stringBoolean(item.actived)}</td>
            <td>{this.stringFormatTime(item.activedDate)}</td>
            <td>{item.activedUser}</td>
            <td>{this.stringBoolean(item.isPaid)}</td>
            <td>{item.remark}</td>
          </tr>
        );
      });
  }

  render() {

    return (
      <div className="animated fadeIn">
        <div className="d-flex justify-content-between">
          <div className="col-md-6">
          <Query query={this.query.bind(this)} />
          </div>

          <div>
            <Link to={"/sn/create"} role="button" className="btn btn-success">
              新建
            </Link>{" "}
          </div>
        </div>
        <br/>
        <div className="table-responsive">
          <table className="table table-bordered table-striped">
            <thead>
              <tr>
                <th>代理商姓名</th>
                <th>充值码</th>
                <th>代理商单价</th>
                <th>生成日期</th>
                <th>激活</th>
                <th>激活日期</th>
                <th>激活用户</th>
                <th>是否收款</th>
                <th>备注</th>
              </tr>
            </thead>
            <tbody>{this.renderList()}</tbody>
          </table>
          <br/>
          <div>合计:{this.state.data.reduce((accumulator, currentValue)=>{
            return accumulator + currentValue.agentPrice
            },0).toFixed(2)}</div>
          <div className="pull-right">
            <ReactPaginate
              previousLabel={"上一页"}
              nextLabel={"下一页"}
              breakLabel={<a href = "" > ...</a>}
              breakClassName={"break-me"}
              pageCount={this.state.pageCount}
              marginPagesDisplayed={2}
              pageRangeDisplayed={5}
              onPageChange={this
              .pagination
              .bind(this)}
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
  return {sn: state.sn, client: state.client};
};
//state表示reducer, combineReducer包含state和dispatch
export default connect(mapStateToProps)(List);
