import {hot} from "react-hot-loader";
import React, {Component} from "react";
import Header from "./Components/Header";
import {Route, Switch, Redirect} from "react-router-dom";
import LoadingBar from "react-redux-loading-bar";

import Keyword from "./Keyword/index";
import My from "./My/index";
import Pay from './Pay/index'
import wxAdminPayList from './Pay/wxPay/admin.listContainer'
import Contact from "./My/contact";
import Charge from "./My/charge";
import Users from "./Users/index";
import Analysis from './Keyword/trace/index'
import "./Components/Header.css";
import {PrivateRoute, refreshClient, UserRoute} from "./lib/check-auth";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {unsetClient} from "./Client/action";
import {fetchProfile} from "./Profile/action";

import {ToastContainer} from "react-toastify";
import Setting from "./Settings/index";
import Pool from './Pools/list'
import Start from './Help/Start'
import Forgetpassword from './ForgetPwd/index'
import Resetpassword from './ForgetPwd/resetpassword'
import SN from './Pay/snPay/index'
import Quora from './Quora/components/index'
import Bill from './bill/container'
import Rewards from './My/reward'
import '../public/scss/app.scss'
import CustomKeywordExtender from './Keyword/trace/customKeywordExtender'
import TagCreate from './Tags/create'

require("react-datepicker/dist/react-datepicker-cssmodules.css");

class App extends Component {
  constructor(props) {
    super();
    this.authenticated = localStorage.getItem("token") != null;
  }

  componentDidMount() {
    console.log('fetchprofile')
    this
      .props
      .fetchProfile();
  }
  unset() {
    if (this.authenticated) {
      this
        .props
        .unsetClient();
      // this.props.dispatch(this.props.unsetClient());
    }
    this
      .props
      .history
      .push("/login");
  }

  render() {
    return (
      <div>
        <LoadingBar/>
        <Header
          unsetClient={this
          .unset
          .bind(this)}
          userName={this.props.userName}/>

        <div className="container">

          <Switch>
            <PrivateRoute path="/my" component={My} dispatch={this.props.dispatch}/>
            <Route path="/contact" component={Contact}/>
            <PrivateRoute path="/pay" component={Pay} dispatch={this.props.dispatch}/>
            <PrivateRoute
              path="/admin_wx_pay"
              component={wxAdminPayList}
              dispatch={this.props.dispatch}/>
            <PrivateRoute
              path="/charge"
              role="admin"
              component={Charge}
              dispatch={this.props.dispatch}/>
            <PrivateRoute
              path="/users"
              role="admin"
              component={Users}
              dispatch={this.props.dispatch}/>
            <PrivateRoute
              path="/pool"
              role="admin"
              component={Pool}
              dispatch={this.props.dispatch}/>
            <PrivateRoute
              path="/bill"
              role="admin"
              component={Bill}
              dispatch={this.props.dispatch}/>
            <PrivateRoute
              path="/keyword"
              component={Keyword}
              dispatch={this.props.dispatch}/>
            <PrivateRoute
              path="/setting"
              component={Setting}
              dispatch={this.props.dispatch}/>
            <PrivateRoute
              path="/reward"
              component={Rewards}
              dispatch={this.props.dispatch}/>
            <PrivateRoute
              path="/analysis/:id"
              component={Analysis}
              dispatch={this.props.dispatch}/>
            <PrivateRoute path="/start" component={Start} dispatch={this.props.dispatch}/>
            <PrivateRoute path="/sn" component={SN} dispatch={this.props.dispatch}/>
            <PrivateRoute
              path="/customkw"
              component={CustomKeywordExtender}
              dispatch={this.props.dispatch}/>

            <Route
              path="/forgetpassword"
              component={Forgetpassword}
              dispatch={this.props.dispatch}/>
            <Route
              path="/resetpassword"
              component={Resetpassword}
              dispatch={this.props.dispatch}/>
            <PrivateRoute
              path="/tag/create"
              component={TagCreate}
              dispatch={this.props.dispatch}/>
            <UserRoute path="/qa" component={Quora} dispatch={this.props.dispatch}/>
            <Redirect from="/" to="/keyword"/>
          </Switch>
        </div>

        <footer id="footer" className="mt-5">

          <div className="row">
            <div className="col-6 text-lg-left text-center">
              <div className="copyright">© Copyright All Rights Reserved</div>
              <div className="credits"/>
            </div>
            <div className="col-lg-6">
              <nav className="footer-links text-lg-right text-center pt-2 pt-lg-0"/>
            </div>
          </div>
          <div className="row">
            <div className="col-12">
              免责声明：钢铁侠应用AI技术优化网站以适应搜索引擎规则，帮助优质网站在搜索引擎获得较好的排名。因影响关键词具体排名的非可控因素较多，我们不承诺具体排名位置。
            </div>
          </div>

        </footer>
        <ToastContainer/>
        <div className="col-md-12">
          <div className="update-nag">
            <div className="update-split">
              <i className="glyphicon glyphicon-refresh"/>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

// referene
// https://stackoverflow.com/questions/36559661/how-can-i-dispatch-from-child-com
// ponents-in-react-redux
const mapStateToProps = state => {
  // if(!state.client.token){   refreshClient(state.client) }
  return state.client;
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    dispatch,
    ...bindActionCreators({
      unsetClient,
      fetchProfile
    }, dispatch)
  };
};
// 不能传mapStateToProps进去，因为PrivateRoute检查token有效后会发起setClient的action, 而
// state里面包含client reducer导致重新render,从而又作验证发起setClient导致死循环
// dashboard不能使用PrivateRoute会引起程序死循环
export default connect(mapStateToProps, mapDispatchToProps)(hot(module)(App));
//export default connect(mapStateToProps, mapDispatchToProps)(App)