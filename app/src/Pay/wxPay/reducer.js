import {RECEIVE_WXPAY} from './contants'

const initialState = {
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case RECEIVE_WXPAY:
      return action.payload
   
    default:
      return state
  }
}

export default reducer
