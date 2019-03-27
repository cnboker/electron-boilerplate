// the actual container component itself and all of the react goodness
import React, { Component } from "react";
import PropTypes from "prop-types";
import { reduxForm, Field } from "redux-form";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { loginRequest, loginFinish } from "./actions";
import { required, renderField } from "../utils/fieldLevelValidation";
// Import the helpers.. that we'll make here in the next step
import FetchMessage from "../notifications/fetchMessage";
import resources from "./locals";
import logo from '../../assets/icons/win/logo.png'
class Login extends Component {
  componentDidMount() {
    console.log("getInterfaceLanguage()", resources.getInterfaceLanguage());
    console.log("getLanguage()", resources.getLanguage());
  }
  // grab what we need from props.  The handleSubmit from ReduxForm
  // and the pieces of state from the global state.
  submit = values => {
    var action = Object.assign({}, values, { returnUrl: this.getReturnUrl() });
    console.log("action,", action);
    this.props.loginRequest(action);
  };

  getReturnUrl() {
    const search = this.props.location.search;
    const params = new URLSearchParams(search);
    var url = params.get("returnUrl") || "";
    if (url) return url;
    if (this.props.location.state)
      return this.props.location.state.from.pathname;
    return "/";
  }
  //在状态或props改变后render之前执行
  componentWillUpdate(nextProps, nextState) {
    //console.log("nextProps", nextProps);
    if (nextProps.login.successful) {
      this.props.loginFinish();
      var url = this.getReturnUrl();
      if (url.indexOf("http:") !== -1) {
        window.location = url;
      } else {
        console.log("url", url);
        if (url) {
          nextProps.history.push(url);
        } else {
          nextProps.history.push("/");
        }
      }
    }
  }

  openLink(url) {
    event.preventDefault();
    let link = event.target.href;
    require("electron").shell.openExternal(link);
  }

  render() {
    const { handleSubmit } = this.props;

    return (
      <div>
        <header className="masthead text-center">
          <img
            className="img-fluid mb-5 d-block mx-auto"
            style={{ width: "128px" }}
            src={logo}
            alt=""
          />
          <h1 className="text-uppercase mb-0">钢铁侠-让您的网站推广变轻松</h1>
          <hr className="star-light" />
          <h5 className="font-weight-light mb-0">
          AI底层技术 - 全站综合提权 - 排名逐步提升 - 效果稳定持久{" "}
          </h5>
          <h5 className="font-weight-light mb-0">
          排名批量监控 - 排名走势跟踪 
          </h5>
        </header>
        <div >
          <form onSubmit={handleSubmit(this.submit)}>
            <div className="app flex-row align-items-center">
              <div className="container">
                <div className="row justify-content-center">
                  <div className="col-md-6">
                    <div className="card mx-4">
                      <div className="card-block p-4">
                        {/*<h1>注册</h1>*/}
                        <p className="text-muted">{resources.login}</p>
                        <Field
                          name="userName"
                          type="text"
                          labelIcon="icon-user"
                          className="form-control"
                          component={renderField}
                          placeholder={"手机号"}
                          validate={required}
                        />
                        <Field
                          name="password"
                          type="password"
                          labelIcon="icon-lock"
                          className="form-control"
                          component={renderField}
                          placeholder={resources.password}
                          validate={required}
                        />
                        <button
                          action="submit"
                          className="btn btn-block btn-success"
                        >
                          {resources.login}
                        </button>
                        <div>
                          {resources.formatString(
                            resources.not_register,
                            <Link to="/signup">{resources.register}</Link>
                          )} { }
                           <Link to="/forgetpassword">忘记密码</Link>
                        </div>

                        <FetchMessage requestState={this.props.login} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

Login.propTypes = {
  handleSubmit: PropTypes.func,
  loginRequest: PropTypes.func,
  login: PropTypes.shape({
    requesting: PropTypes.bool,
    successfull: PropTypes.bool,
    messages: PropTypes.array,
    errors: PropTypes.array
  })
};

//Grab only the peice of state we need
// state.signup name came from when we combined our reducers
const mapStateToProps = state => ({
  login: state.login,
  client: state.client
});

const connected = connect(
  mapStateToProps,
  { loginRequest, loginFinish }
)(Login);

const formed = reduxForm({
  form: "login"
})(connected);

export default formed;
