import React from 'react';
import ReactDOM from 'react-dom';
import { applyMiddleware, createStore, compose } from 'redux'
import { Provider } from 'react-redux'
import createSegaMiddleware from 'redux-saga'
//import { HashRouter, Route, Switch } from 'react-router-dom'
//import { createBrowserHistory } from 'history';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

// Containers
import App from './App'
import Home from './Container/Home'
// Views
import Login from './Login'
import Signup from './Signup'
import Page404 from './Page404'
import Page500 from './Page500'

//Import the index reducer and sagas
import IndexReducer from './index-reducer'
import IndexSagas from './index-sagas'
import thunk from 'redux-thunk'
//https://github.com/wwayne/redux-reset
import reduxReset from 'redux-reset'
//import initReactFastclick from 'react-fastclick'
import { loadingBarMiddleware } from 'react-redux-loading-bar'

//initReactFastclick()

//Setup the sagaMiddleware to watch between Reducers and Actions
const sagaMiddleware = createSegaMiddleware()
/*eslint-disable */
const composeSetup = process.env.NODE_ENV !== 'production' && typeof window === 'object' &&
  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?
  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ : compose
/*eslint-enable */
const store = createStore(
  IndexReducer,
  composeSetup(applyMiddleware(sagaMiddleware, thunk, loadingBarMiddleware()), reduxReset())
)

//Begin out Index Saga
sagaMiddleware.run(IndexSagas)

//Should be set in your console to see messages
localStorage.debug = true
//Configure the max length of module names (optional)
//bows.config({ padLength: 10 })
var render =(Component)=>(
  <Provider store={store}>
    <Router>
    <Switch>
      <Route exact path="/login" name="Login Page" component={Login} />
      <Route exact path="/signup" name="Sign Page" component={Signup} />
      <Route exact path="/404" name="Page 404" component={Page404} />
      <Route exact path="/500" name="Page 500" component={Page500} />
      <Route path="/" extact component={Component} />
      </Switch>
    </Router>
  </Provider>
);
ReactDOM.render(render(App), document.getElementById('root'))

if (module.hot) {
  module.hot.accept('./App', () => {
    const App = require('./App').default;
    render(App);
  });
}
