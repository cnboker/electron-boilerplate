// the actual container component itself and all of the react goodness
import React, { Component } from "react";
import { reduxForm, Field } from "redux-form";
import { connect } from "react-redux";
import { required, renderField } from "../utils/fieldLevelValidation";
// Import the helpers.. that we'll make here in the next step
import FetchMessage from "../notifications/fetchMessage";
import axios from 'axios'

class ForgetPassword extends Component {
  constructor() {
      super()
    this.state = {
      message: {
        successful: false,
        message: "",
        errors:[]
      }
    };
  }
  componentDidMount() {}

  submit = values => {
    var self = this;
    const url = `${process.env.REACT_APP_API_URL}/user/forgetpassword`;

    axios({
      method: "post",
      url: url,
      data: values
    })
      .then(function(res) {
          console.log('response',res)
        if (res.data) {
         
            self.props.history.push({pathname:'./resetpassword',state:{userName:values.userName}})
        } else {
          self.setState({
            message: {
              successful: false,
              errors: [{body:"验证失败"}]
            }
          });
        }
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
                      <p className="text-muted">忘记密码</p>
                      <Field
                        name="userName"
                        type="text"
                        className="form-control"
                        component={renderField}
                        placeholder="手机号"
                        validate={required}
                      />
                      <Field
                        name="mail"
                        type="mail"
                        className="form-control"
                        component={renderField}
                        placeholder="邮箱"
                        validate={required}
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
  })(ForgetPassword)
);
