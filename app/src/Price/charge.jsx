import React, { Component } from "react";
import { required } from "../utils/fieldLevelValidation";
import { renderField } from "../Components/Forms/RenderField";
import { reduxForm, Field } from "redux-form";
import axios from "axios";
import { toast } from "react-toastify";
import { connect } from "react-redux";

class Charge extends Component {
  constructor(props) {
    super(props);
    this.submitStart = false;
  }

  submit(values) {
    var self = this;
    this.submitStart = true;
    const url = `${process.env.REACT_APP_API_URL}/pay`;

    axios({
      method: "post",
      url: url,
      data: values,
      headers: {
        Authorization: `Bearer ${this.props.client.token.access_token}`
      }
    })
      .then(function(res) {
        self.submitStart = false;
        toast.info("充值成功", {
          position: toast.POSITION.BOTTOM_CENTER
        });
      })
      .catch(function(e) {
        self.submitStart = false;
        toast.error(e.response.data.message, {
          position: toast.POSITION.BOTTOM_CENTER
        });
      });
  }

  componentDidMount() {}

  render() {
    const { handleSubmit } = this.props;

    return (
      <div>
        <form onSubmit={handleSubmit(this.submit.bind(this))}>
          <Field
            name="userName"
            type="text"
            label="账户"
            component={renderField}
            validate={required}
            placeholder="输入账户名称"
          />
          <Field
            name="amount"
            type="number"
            parse={value => Number(value)}
            label="充值金额"
            component={renderField}
            validate={required}
            placeholder="0"
          />
          <button
            action="submit"
            className="btn btn-block btn-success"
            disabled={this.submitStart}
          >
            充值
          </button>
        </form>
       
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return { client: state.client };
};
//state表示reducer, combineReducer包含state和dispatch
export default connect(mapStateToProps)(
  reduxForm({
    form: "form"
  })(Charge)
);
