import {
  RECEIVE_ALL_BILLS,
  RECEIVE_UPDATE_BILL,
  RECEIVE_USER_WXQR
} from "./action";
import merge from "lodash/merge";

const billReducer = (
  state = {
    docs: [],
    pages: 0
  },
  action
) => {
  Object.freeze(state);
  let newState = merge({}, state);

  switch (action.type) {
    case RECEIVE_ALL_BILLS:
      return action.bills;
    case RECEIVE_UPDATE_BILL:
      newState.docs[action.bill._id] = action.bill;
      return newState;
    case RECEIVE_USER_WXQR:
      newState.docs[action.payload.id].wxpayUrl = action.payload.qr    
      return newState;
    default:
      return state;
  }
};

export default billReducer;
