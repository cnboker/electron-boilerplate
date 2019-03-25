import axios from 'axios';
import {toast} from "react-toastify";
import {RECEIVE_WXPAY} from './contants';

var auth = require("~/src/lib/check-auth");

export const receivewxPay = payload => {
  return {type: RECEIVE_WXPAY, payload}
}

export const requestwxPay = () => dispatch => {
  var url = `${process.env.REACT_APP_API_URL}/qr/pending`;
  var headers = auth.authHeader();
  axios({url, method: 'get', headers}).then(response => {
    dispatch(receivewxPay(response.data))
  }).catch(e => {
    toast.error(e.message, {position: toast.POSITION.BOTTOM_CENTER});
  })
}

export const postwxPay = () => dispatch => {
  var url = `${process.env.REACT_APP_API_URL}/qr/postwxPay`;
  var headers = auth.authHeader();
  axios({url, method: 'post', headers}).then(response => {
    dispatch(receivewxPay(response.data))
  }).catch(e => {
    toast.error(e.message, {position: toast.POSITION.BOTTOM_CENTER});
  })
}