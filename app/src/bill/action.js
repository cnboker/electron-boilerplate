var api = require('./api')
export const RECEIVE_ALL_BILLS = 'RECEIVE_ALL_BILLS'
export const RECEIVE_UPDATE_BILL = 'RECEIVE_UPDATE_BILL';
export const RECEIVE_USER_WXQR = 'RECEIVE_USER_WXQR';

export const receiveAllBills = (bills) => {
  return {type: RECEIVE_ALL_BILLS, bills}
}

export const receivewxQR =(id,qr) =>{
  return {type: RECEIVE_USER_WXQR, payload:{id,qr}}
}

export const receiveUpdateBill = (bill) => {
  return {type: RECEIVE_UPDATE_BILL, bill}
}

export const fetchAll = (terms) => dispatch => {
  api
    .fetchAll(terms)
    .then(res => {
      dispatch(receiveAllBills(res.data))
    })
}

export const billPay = (id) => dispatch => {
  api
    .billPay(id)
    .then(res => {
      dispatch(receiveUpdateBill(res.data))
    })
}

export const wxqr = (id,user) => dispatch => {
  api
    .wxqr(user)
    .then(res => {
      dispatch(receivewxQR(id,res.data))
    })
}