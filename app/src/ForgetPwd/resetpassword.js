// the actual container component itself and all of the react goodness
import React, { Component } from "react";
import { reduxForm, Field } from "redux-form";
import { connect } from "react-redux";
import FetchMessage from "../notifications/fetchMessage";
import axios from "axios";
import resources from "../Signup/locals";
import { required, renderField, email, minLength6 } from '../utils/fieldLevelValidation'

class ResetPassword extends Component {
  constructor() {
    super();
    this.state = {
      message: {
        successful: false,
        message: "",
        errors: []
      }
    };
  }
  componentDidMount() {}

  submit = values => {
      const {state} = this.props.location;
    var self = this;
    if (values.password !== values.repassword) {
      throw new SubmissionError({
        repeatPassword: resources.password_mismatch,
        _error: resources.register_failure
      });
    }
    var self = this;
    const url = `${process.env.REACT_APP_API_URL}/user/resetpassword`;

    axios({
      method: "post",
      url: url,
      data: {newpassword:values.password,userName:state.userName}
    })
      .then(function(res) {
        self.props.history.push("/login");
      })
      .catch(function(e) {
        console.log(e);
      });
  };

  render() {
    const { handleSubmit } = this.props;

    return (
      <div>
        <form onSubmit={handleSubmit(this.submit)}>
          <div className="app flex-row align-items-center">
            <div className="container">
              <div className="row justify-content-center">
                <div className="col-md-6">
                  <div className="card mx-4">
                    <div className="card-block p-4">
                      {/*<h1>注册</h1>*/}
                      <p className="text-muted">重置密码</p>
                      <Field
                        name="password"
                        type="password"
                        className="form-control"
                        component={renderField}
                        placeholder="密码"
                        validate={[required, minLength6]}
                      />
                      <Field
                        name="repassword"
                        type="password"
                        className="form-control"
                        component={renderField}
                        placeholder="确认密码"
                        validate={[required, minLength6]}
                      />
                      <button
                        action="submit"
                        className="btn btn-block btn-success"
                      >
                        确定
                      </button>

                      <FetchMessage requestState={this.state.message} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
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
  })(ResetPassword)
);
