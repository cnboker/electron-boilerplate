import React, { Component } from "react";
import { required } from "../utils/fieldLevelValidation";
import { renderField } from "../Components/Forms/RenderField";
import { reduxForm, Field } from "redux-form";
import axios from "axios";
import { toast } from "react-toastify";
import { connect } from "react-redux";

class SNActive extends Component {
  constructor(props) {
    super(props);
    this.submitStart = false;
  }

  submit(values) {
    var self = this;
    this.submitStart = true;
    const url = `${process.env.REACT_APP_API_URL}/sn/snActivate`;

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
        toast.info("激活成功", {
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
      <form onSubmit={handleSubmit(this.submit.bind(this))}>
        <Field
          name="sn"
          type="text"
          label="充值码"
          component={renderField}
          validate={required}
          placeholder="输入激活码"
        />
     
        <button
          action="submit"
          className="btn btn-block btn-success"
          disabled={this.submitStart}
        >
          激活
        </button>
      </form>
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
  })(SNActive)
);
