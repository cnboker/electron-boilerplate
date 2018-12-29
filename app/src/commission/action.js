var api = require('./api')
export const RECEIVE_ALL_COMMISSIONS = 'RECEIVE_ALL_COMMISSIONS'
export const RECEIVE_UPDATE_COMMISSION = 'RECEIVE_UPDATE_COMMISSION';

export const receiveAllCommissions = (commissions) => {
  return {type: RECEIVE_ALL_COMMISSIONS, commissions}
}

export const receiveUpdateCommission = (commission) => {
  return {type: RECEIVE_UPDATE_COMMISSION, commission}
}

export const fetchAll = (terms) => dispatch => {
  api
    .fetchAll(terms)
    .then(res => {
      dispatch(receiveAllCommissions(res.data))
    })
}

export const commissionPay = (id) => dispatch => {
  api
    .commissionPay(id)
    .then(res => {
      dispatch(receiveUpdateCommission(res.data))
    })
}