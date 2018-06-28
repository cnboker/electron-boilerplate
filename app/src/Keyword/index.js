import List from './List'
import New from './New'
import React, { Component } from 'react'

import {Route, Switch } from 'react-router-dom'
import TableContainer from '../Components/Tables/TableContainer'


class Index extends Component {
 

  render() {
    return (

      <div>
        <div className="alert alert-primary" role="alert">关键字添加完后,后台程序就会对关键字做优化工作，请不要关闭程序耐心等待结果.</div> 
       
          <Switch>
            <Route path="/keyword/:id" component={New}/>
            <Route path="/keyword/new" component={New}/>
            <Route path="/keyword" exact component={List}/>
            {/*<Route path='/svr' extact render={()=><List dispatch={props.dispatch} source={props.svrs} />} />*/}
          </Switch>
        
       
      </div>
    )
  }
}

export default Index


