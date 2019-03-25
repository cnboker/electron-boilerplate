import List from "./list";
import Form from "./form";
import React, {Component} from "react";
import {Route, Switch} from "react-router-dom";
import {PrivateRoute} from "~/src/lib/check-auth";
import {connect} from "react-redux";

class Index extends Component {
  render() {
    return (
      <div>
        <Switch>
          <PrivateRoute
            path="/sn/create/:id"
            component={Form}
            role="admin"
            {...this.props}/>
          <PrivateRoute
            path="/sn/create"
            component={Form}
            role="admin"
            {...this.props}/>
          <PrivateRoute
            path="/sn"
            exact
            component={List}
            role="admin"
            {...this.props}/>
        </Switch>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    client:state.client
  }
}
//state表示reducer, combineReducer包含state和dispatch
export default connect(mapStateToProps)(Index)