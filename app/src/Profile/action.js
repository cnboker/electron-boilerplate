import {USER_PROFILE} from './constants'
import axios from 'axios'

export const receiveProfile = (payload) => {
  return {type: USER_PROFILE, payload}
}

export const fetchProfile = () => dispatch => {
  var headers = require('../lib/check-auth').authHeader();
  const url = `${process.env.REACT_APP_API_URL}/profile`
  const promise = axios({url: url, method: "get", headers})
  promise.then(response => {
    dispatch(receiveProfile(response.data))
  })
}

//更新用户数据
export const userUpdate = (userName, setting) => dispatch => {
  var headers = require('../lib/check-auth').authHeader();

  const url = `${process.env.REACT_APP_API_URL}/user/update`
  const promise = axios({
    url,
    method: 'put',
    data: {
      userName,
      ...setting
    },
    headers
  })
  promise.then(response => {
    dispatch(receiveProfile(response.data))
  })
}