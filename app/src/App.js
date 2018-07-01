import { hot } from "react-hot-loader";
import React, { Component } from "react";
import Header from "./Components/Header";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect
} from "react-router-dom";
import Keyword from "./Keyword/index";
import Start from "./Container/Start";
import Price from "./Price/index";
import Contact from "./Price/contact";
import Charge from './Price/charge'
import "./Components/Header.css";
import { PrivateRoute,refreshClient } from "./lib/check-auth";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { unsetClient } from "./Client/action";
import { ToastContainer } from "react-toastify";

class App extends Component {
  constructor(props) {
    super();
    this.authenticated = localStorage.getItem('token') != null;
  }
  unset() {
    if (this.authenticated) {
      this.props.unsetClient();
     // this.props.dispatch(this.props.unsetClient());
    }
    this.props.history.push("/login");
  }

  render() {
    return (
      <div>
        <Header
          unsetClient={this.unset.bind(this)}
          userName = {this.props.token == null?"":this.props.token.userName}
        />

        <div className="container">
          <Switch>
            <Route path="/start" component={Start} />
            <PrivateRoute
              path="/price"
              component={Price}
              dispatch={this.props.dispatch}
            />
            <Route path="/contact" component={Contact} />
            
            <PrivateRoute
              path="/charge"
              role="admin"
              component={Charge}
              dispatch={this.props.dispatch}
            />
            <PrivateRoute
              path="/keyword"
              component={Keyword}
              dispatch={this.props.dispatch}
            />
            <Redirect from="/" to="/keyword" />
          </Switch>
        </div>
        <footer id="footer">
          <div className="container">
            <div className="row">
              <div className="col-6 text-lg-left text-center">
                <div className="copyright">© Copyright All Rights Reserved</div>
                <div className="credits">
                  {" "}
                  Designed by
                  <a href="#">易优</a>
                </div>
              </div>
              <div className="col-lg-6">
                <nav className="footer-links text-lg-right text-center pt-2 pt-lg-0" />
              </div>
            </div>
          </div>
        </footer>
        <ToastContainer />
        <div className="col-md-12">
          <div className="update-nag">
            <div className="update-split">
              <i className="glyphicon glyphicon-refresh" />
            </div>
            <div className="update-text" id="__messages" />
          </div>
        </div>
      </div>
    );
  }
}

// referene
// https://stackoverflow.com/questions/36559661/how-can-i-dispatch-from-child-com
// ponents-in-react-redux
const mapStateToProps = state => 
{
  // if(!state.client.token){
  //   refreshClient(state.client)
  // }
  return state.client;
}


const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    dispatch,
    ...bindActionCreators({unsetClient }, dispatch)
  }
}
// 不能传mapStateToProps进去，因为PrivateRoute检查token有效后会发起setClient的action, 而
// state里面包含client reducer导致重新render,从而又作验证发起setClient导致死循环
// dashboard不能使用PrivateRoute会引起程序死循环
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(hot(module)(App));
//export default connect(mapStateToProps, mapDispatchToProps)(App)
