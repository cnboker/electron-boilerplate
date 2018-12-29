import {RECEIVE_ALL_COMMISSIONS, RECEIVE_UPDATE_COMMISSION} from './action'
import merge from 'lodash/merge'

const CommissionReducer = (state = {
  docs: [],
  pages: 0
}, action) => {
  Object.freeze(state)
  let newState = merge({}, state);

  switch (action.type) {
    case RECEIVE_ALL_COMMISSIONS:
      return action.commissions;
    case RECEIVE_UPDATE_COMMISSION:
      newState.docs[action.commission._id] = action.commission;
      return newState;
    default:
      return state;
  }
}

export default CommissionReducer;