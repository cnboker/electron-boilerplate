import React, {Component} from 'react'
import {Button} from 'react-bootstrap'
import Header from './Components/Header'
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'
import Home from './Container/Home'
import Keyword from './Keyword/index'
import Start from './Container/Start'
import classNames from 'classnames'
import './Components/Header.css'
//route test https://pshrmn.github.io/route-tester/#/
export default class App extends Component {

  render() {
    return (
     
      <div>
        <Header/>
        <div className={classNames('container', 'marginTop70')}>
          <Switch>
            <Route path='/keyword' component={Keyword}/>
            <Route exact path='/' component={Home}/>
            <Route path="/start" component={Start}/>
          </Switch>
        </div>

      </div>

    )
  }
}
