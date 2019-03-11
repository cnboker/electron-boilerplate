import List from "./components/keyword_index_container";
import New from "./New";
import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";

class Index extends Component {
  render() {
    return (
      <div>
        <Switch>
         
          <Route path="/keyword/:id" component={New} />

          <Route path="/keyword/new" component={New} />

          <Route path="/keyword" exact component={List} />
          {/*<Route path='/svr' extact render={()=><List dispatch={props.dispatch} source={props.svrs} />} />*/}
        </Switch>
      </div>
    );
  }
}

export default Index;
