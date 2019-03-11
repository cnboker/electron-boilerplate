import {CLIENT_SET, CLIENT_UNSET, USER_PROFILE} from './constants'
import axios from 'axios'
var headers = require('../lib/check-auth').authHeader();

export function setClient(token) {
  return {type: CLIENT_SET, token}
}

export function unsetClient() {
  return {type: CLIENT_UNSET}
}

export const receiveProfile = (payload) => {
  return {type: USER_PROFILE, payload}
}

export const fetchProfile = () => dispatch => {
  const url = `${process.env.REACT_APP_API_URL}/profile`
  const promise = axios({url: url, method: "get", headers})
  promise.then(response => {
    dispatch(receiveProfile(response.data))
  })
}