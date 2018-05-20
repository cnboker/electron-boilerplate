import React, {Component} from 'react'
import {Button} from 'react-bootstrap'
import Header from './Components/Header'
import {BrowserRouter as Router, Route} from 'react-router-dom'
import Home from './Container/Home'
import Config from './Container/Config'
import Start from './Container/Start'

export default class App extends Component {

  render() {
    return (
      <Router>
      <div>
        <Header/>
        <hr/>
        <Route exact path='/' component={Home}/>
        <Route path="/config" component={Config} />
        <Route path="/start" component={Start} />
      </div>
      </Router>
    )
  }
}
