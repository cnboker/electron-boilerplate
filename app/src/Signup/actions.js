import { SIGNUP_REQUESTING } from './constants'

const signupRequest = function signupRequest ({ userName, email, password }) {  
  return {
    type: SIGNUP_REQUESTING,
    userName,
    email,
    password,
  }
}
export default signupRequest