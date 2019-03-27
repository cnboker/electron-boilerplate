import {CLIENT_SET, CLIENT_UNSET} from "./constants"

const initialState = {
  token: null,
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case CLIENT_SET:
      if (state.token != null && state.token.access_token === action.token.access_token) {
        return state
      }
      return {
        ...state,
        token: action.token
      }

    case CLIENT_UNSET:
      return {token: null}
    
    default:
      return state
  }
}

export default reducer
