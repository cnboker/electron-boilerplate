import { default as crudActions } from "./actions";
import React, { Component } from "react";
import { connect } from "react-redux";
import moment from "moment";
import AddItem from "./add";
import Dialog from "../Components/Modals/Dialog";

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

  fetch() {
    const action = crudActions.fetch(0, 0, true, this.props.client, this.props.match.params.id);
    this.dispatch(action);
  }

  get dispatch() {
    return this.props.dispatch;
  }

  onAdd(){
    console.log('onadd run...')
    this.fetch();
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

  renderList() {
    var self = this;
    return this.props.events      
      .map(item => {
        return (
          <tr key={item._id}>
            <td>
              {item.text +
                "," +
                moment(item.createDate).format("YYYY-MM-DD")}
            </td>

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
    console.log("option select", selectedOption);
  }

  render() {
    return (
      <div className="animated fadeIn">
        <AddItem className="info" {...this.props} onAdd={this.onAdd.bind(this)} />
        <Dialog ref="dialog" />
        <div className="table-responsive">
          <br />
          <table className="table table-bordered table-striped">
            <thead>
              <tr>
                <th>内容</th>

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
  return { events: state.events, client: state.client };
};
//state表示reducer, combineReducer包含state和dispatch
export default connect(mapStateToProps)(List);
