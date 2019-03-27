import axios from 'axios';
import {toast} from "react-toastify";
import {RECEIVE_WXPAY, RECEIVE_ALL_WXPAY, RECEIVE_PENDING_WXPAY} from './contants';

var auth = require("~/src/lib/check-auth");

export const receivewxPay = payload => {
  return {type: RECEIVE_WXPAY, payload}
}

export const receiveAll = payload => {
  return {type: RECEIVE_ALL_WXPAY, payload};
};

export const receivePending = payload => {
  return {type: RECEIVE_PENDING_WXPAY, payload};
};

export const findAllPay = (terms) => dispatch => {
  var query = Object
    .keys(terms)
    .map(key => {
      return (encodeURIComponent(key) + "=" + encodeURIComponent(terms[key]));
    })
    .join("&");
  var url = `${process.env.REACT_APP_API_URL}/qr/list?${query}`;
  var headers = auth.authHeader();
  axios({url, method: 'get', headers}).then(response => {
    var docs = response
      .data
      .reduce((map, doc) => {
        map[doc._id] = doc;
        return map;
      }, {});
    dispatch(receiveAll(docs))
  }).catch(e => {
    toast.error(e.message, {position: toast.POSITION.BOTTOM_CENTER});
  })
}

//pending pay
export const requestwxPay = () => dispatch => {
  var url = `${process.env.REACT_APP_API_URL}/qr/pending`;
  var headers = auth.authHeader();
  axios({url, method: 'get', headers}).then(response => {
    dispatch(receivePending(response.data))
  }).catch(e => {
    toast.error(e.message, {position: toast.POSITION.BOTTOM_CENTER});
  })
}

//submit pay
export const postwxPay = () => dispatch => {
  var url = `${process.env.REACT_APP_API_URL}/qr/postwxPay`;
  var headers = auth.authHeader();
  axios({url, method: 'post', headers}).then(response => {
    dispatch(receivewxPay(response.data))
  }).catch(e => {
    toast.error(e.message, {position: toast.POSITION.BOTTOM_CENTER});
  })
}

export const confirmPay = (payno) => dispatch => {
  var url = `${process.env.REACT_APP_API_URL}/qr/confirm`;
  var headers = auth.authHeader();
  axios({url, method: 'post', data: {
      payno
    }, headers}).then(response => {
    dispatch(receivewxPay(response.data))
  }).catch(e => {
    toast.error(e.message, {position: toast.POSITION.BOTTOM_CENTER});
  })
}

//cancel pay
export const cancelPay = (payno) => dispatch => {
  var url = `${process.env.REACT_APP_API_URL}/qr/cancel`;
  var headers = auth.authHeader();
  axios({url, method: 'post', data: {
      payno
    }, headers}).then(response => {
    dispatch(receivewxPay(response.data))
  }).catch(e => {
    toast.error(e.message, {position: toast.POSITION.BOTTOM_CENTER});
  })
}