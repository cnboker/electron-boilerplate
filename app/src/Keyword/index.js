import List from './List'
import New from './New'
import React, { Component } from 'react'

import {Route, Switch } from 'react-router-dom'
import TableContainer from '../Components/Tables/TableContainer'


class Index extends Component {
 

  render() {
    return (

      <div>
        <TableContainer title="关键字管理">
          <Switch>
            <Route path="/keyword/:id" component={New}/>
            <Route path="/keyword/new" component={New}/>
            <Route path="/keyword" exact component={List}/>
            {/*<Route path='/svr' extact render={()=><List dispatch={props.dispatch} source={props.svrs} />} />*/}
          </Switch>
        
        </TableContainer>
      </div>
    )
  }
}

export default Index


