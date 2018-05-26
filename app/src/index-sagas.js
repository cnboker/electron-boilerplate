import SignupSaga from './Signup/sagas'
import LoginSaga from './Login/sagas'

export default function* IndexSaga() {
  yield [
    SignupSaga(),
    LoginSaga(),
   
  ]

}