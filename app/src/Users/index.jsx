import List from "./List";
import UserKeywords from './userKeywords'
import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";

class Index extends Component {
  render() {
    return (
      <div>
        <Switch>
          <Route path="/users/keywords/:id" component={UserKeywords} />
          <Route path="/users" exact component={List} />
        </Switch>
      </div>
    );
  }
}

export default Index;
