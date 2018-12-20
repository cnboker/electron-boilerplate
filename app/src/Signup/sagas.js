import { call, put, takeLatest } from 'redux-saga/effects'
import { SIGNUP_REQUESTING, SIGNUP_SUCCESS, SIGNUP_ERROR } from './constants'
import { ResponseHandle } from "../utils/ResponseHandle"
import { setClient } from "../Client/action";
import Cookies from "js-cookie";

const signupUrl = `${process.env.REACT_APP_AUTH_URL}/api/signup`

//json exception handle
function signupApi(userName, email, password) {
  console.log('signupApi', `userName:${userName},email:${email},password:${password}`)
  return fetch(signupUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ userName, email, password })
  })
    // .then(response => {
    //   return response.json().then(json => {
    //     return response.ok ? json : 
    //     Promise.reject(json).then(e){
    //       throw error(e.map(function(item)=>item.description).join(','))
    //     }
    //   })
    // })

  .then(ResponseHandle)
  //.then(response => response.json())
  //.then(json => json)
  .catch((error) => { throw error })
}

function* signupFlow(action) {
  try {
    const { userName, email, password } = action
    // pulls "calls" to our signupApi with our email and password
    // from our dispatched signup action, and will PAUSE
    // here until the API async function, is complete!
    const response = yield call(signupApi, userName, email, password)

    var token = { ...response, userName }
    yield put(setClient(token));

    var tokenString = JSON.stringify(token);
    localStorage.setItem("token", tokenString);

    Cookies.set("token", tokenString, { expires: 360, path: ""});

    // when the above api call has completed it will "put",
    // or dispatch, an action of type SIGNUP_SUCCESS with
    // the successful response.
    yield put({ type: SIGNUP_SUCCESS, response })
  } catch (error) {
    yield put({ type: SIGNUP_ERROR, error })
  }

}

function* signupWather() {
  yield takeLatest(SIGNUP_REQUESTING, signupFlow)
}

export default signupWather