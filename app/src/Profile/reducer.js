import {USER_PROFILE} from "./constants"

const reducer = (state = {}, action) => {
  switch (action.type) {
   
    case USER_PROFILE:
     return action.payload
    default:
      return state
  }
}

export default reducer
