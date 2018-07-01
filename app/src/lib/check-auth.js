import React from 'react'
import { Route, Redirect } from 'react-router-dom'
import { setClient, unsetClient } from '../Client/action'

export function refreshClient(client) {
  const storedToken = localStorage.getItem('token')

  // if it exists
  if (storedToken) {
    // parse it down into an object
    const token = JSON.parse(storedToken)
    var jsTicks = (new Date()).getTime() * 10000 + 621355968000000000
    // if the token has expired return false
    console.log('span time', (token.expired - jsTicks) / 10000)
   // if (token.expired > jsTicks) {
      client.token = token
   // }
  }
}

export function checkAuthorization(dispatch,next) {
  // attempt to grab the token from localstorage
  const storedToken = localStorage.getItem('token')

  // if it exists
  if (storedToken) {
    // parse it down into an object
    const token = JSON.parse(storedToken)
    var jsTicks = (new Date()).getTime() * 10000 + 621355968000000000
    // if the token has expired return false
    console.log('span time', (token.expired - jsTicks) / 10000)
    if (token.expired < jsTicks) {
      dispatch(unsetClient())
      return false
    }
    if(next && next.role == 'admin' &&  token.userName != 'admin'){
      dispatch(unsetClient())
      return false;
    }
    dispatch(setClient(token))
    return true;
  }

  return false
}



export function PrivateRoute({ component: Component, dispatch, state, ...rest }) {

  const authed = checkAuthorization(dispatch,rest)
  return (
    <Route
      {...rest}
      render={(props) => authed === true
        ? <Component {...props} />
        : <Redirect to={{ pathname: '/login', state: { from: props.location } }} />}
    />
  )
}