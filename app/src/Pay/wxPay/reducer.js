import {RECEIVE_WXPAY, RECEIVE_ALL_WXPAY, RECEIVE_PENDING_WXPAY} from './contants'
import merge from 'lodash/merge'

const reducer = (state = [], action) => {
  Object.freeze(state)
  let newState = merge({}, state)
  switch (action.type) {
    case RECEIVE_PENDING_WXPAY:
      return action.payload;
    case RECEIVE_ALL_WXPAY:
      return action.payload;
    case RECEIVE_WXPAY:
      if (Array.isArray(action.payload)) {
        for (let k of action.payload) {
          newState[k._id] = k;
        }
      } else {
        newState[action.payload._id] = action.payload;
      }
      return newState;
   
    default:
      return state
  }
}

export default reducer
