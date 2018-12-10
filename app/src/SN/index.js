import List from "./list";
import Form from "./form";
import SNActive from './snActive'
import React, {Component} from "react";
import {Route, Switch} from "react-router-dom";

class Index extends Component {
  render() {
    return (
      <div>
        <Switch>
          <Route path='/sn/snActive' component={SNActive}/>
          <Route path="/sn/create/:id" component={Form}/>
          <Route path="/sn/create" component={Form}/>
          <Route path="/sn" exact component={List}/>
        </Switch>
      </div>
    );
  }
}

export default Index;
