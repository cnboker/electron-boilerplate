import {CLIENT_SET, CLIENT_UNSET, USER_PROFILE} from "./constants"

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
    case USER_PROFILE:
      return {
        ...state,
        profile: action.payload,
      }
    default:
      return state
  }
}

export default reducer
