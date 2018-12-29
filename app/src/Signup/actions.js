import { SIGNUP_REQUESTING } from './constants'

const signupRequest = function signupRequest (terms) {  
  return {
    type: SIGNUP_REQUESTING,
    terms
  }
}
export default signupRequest