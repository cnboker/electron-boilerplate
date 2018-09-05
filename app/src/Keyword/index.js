import List from './List'
import New from './New'
import Setting from './setting'
import React, { Component } from 'react'

import {Route, Switch } from 'react-router-dom'
import TableContainer from '../Components/Tables/TableContainer'


class Index extends Component {
 

  render() {
    return (

      <div>
        <div className="alert alert-primary" role="alert">保持程序后台运行即可，优化工作正在进行中...</div> 
       
          <Switch>
            <Route path="/keyword/new" component={New}/>
            <Route path="/keyword/setting"  component={Setting}/>
            <Route path="/keyword/:id" component={New}/>
            <Route path="/keyword" exact component={List}/>
            {/*<Route path='/svr' extact render={()=><List dispatch={props.dispatch} source={props.svrs} />} />*/}
          </Switch>
        
       
      </div>
    )
  }
}

export default Index


