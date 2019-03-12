import React, { Component } from "react";
import { connect } from "react-redux";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import DatePicker from "react-datepicker";
import moment from "moment";
import { reduxForm, Field } from "redux-form";
import TextareaAutosize from "react-autosize-textarea";
import actions from "./actions";
import { RowContainer } from "../../Components/Forms/RowContainer";

class AddItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      date: moment()
    };
    this.toggle = this.toggle.bind(this);
  }

  toggle(e) {
    e.preventDefault();
    this.setState({
      modal: !this.state.modal
    });
  }

  submit(values) {
    console.log("values", values);
    const { onAdd } = this.props;
    var text = this.textarea.value;
    if (text == "") {
      this.textarea.focus();
      return;
    }
    var entity = {
      createDate: this.state.date,
      text,
      keyword_id:  this.props.match.params.id
    };

    console.log(entity);

    var action = actions.create(entity, this.props.client);
    this.props
      .dispatch(action)
      .then(response => {
        if (onAdd) onAdd();
      })
      .catch(e => {
        console.log("event.add", e);
      });

      this.setState({
        modal: !this.state.modal
      });
  }

  render() {
    const { match } = this.props;

    return (
      <div>
        <div className="span_row">
          <a href="#" onClick={this.toggle} alt="添加事件">
            <i className="fa fa-calendar-plus-o fa-lg" />
          </a>
        </div>
        <Modal
          isOpen={this.state.modal}
          toggle={this.toggle}
          className={"modal-lg " + this.props.className}
        >
          <ModalHeader toggle={this.toggle}>添加事件</ModalHeader>
          <ModalBody>
            <form>
              <RowContainer label="内容">
                <TextareaAutosize
                  rows={1}
                  placeholder="记录网站当前关键词的优化笔记"
                  className="form-control"
                  innerRef={ref => (this.textarea = ref)}
                />
              </RowContainer>
              <RowContainer label="日期">
                <DatePicker
                  className="form-control"
                  selected={this.state.date}
                  onChange={date => {
                    this.setState({ date});
                  }}
                />
              </RowContainer>
            </form>
          </ModalBody>
          <ModalFooter>
            <Button
              action="submit"
              color="primary"
              onClick={this.submit.bind(this)}
            >
              确定
            </Button>{" "}
            <Button color="secondary" onClick={this.toggle}>
              取消
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

AddItem = reduxForm({
  form: "form"
})(AddItem);
const mapStateToProps = (state, ownProps) => {
  return {
    client: state.client
  };
};
export default connect(mapStateToProps)(AddItem);
