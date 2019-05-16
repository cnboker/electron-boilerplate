import { combineReducers } from 'redux'
import { reducer as form } from 'redux-form'
import signup from './Signup/reducer'
import client from './Client/reducer'
import login from './Login/reducer'
import {websiteReducer,keywordReducer} from './Keyword/index/reducers/keyword_reducer'
import eventReducer from './Keyword/Event/reducer'
import userReducer from './Users/reducer'
import { loadingBarReducer } from 'react-redux-loading-bar'
import snReducer from './Pay/snPay/reducer'
import questionReducer from './Quora/reducers/question_reducer'
import tagReducer from './Tags/reducer'
import billReducer from './bill/reducer'
import voteReducer from './Vote/reducer'
import wxpayReducer from './Pay/wxPay/reducer'
import userProfileReducer from './Profile/reducer'

const appReducer = combineReducers({
  /* your app’s top-level reducers */
  form,
  signup,
  client,
  login,
  keywords: keywordReducer,
  websites: websiteReducer,
  loadingBar: loadingBarReducer,
  users:userReducer,
  events: eventReducer,
  sn:snReducer,
  questions:questionReducer,
  tagReducer,
  bills: billReducer,
  votes:voteReducer,
  wxpay:wxpayReducer,
  userProfile:userProfileReducer
})

//https://stackoverflow.com/questions/35622588/how-to-reset-the-state-of-a-redux-store
//退出程序重置state

const IndexReducer = (state, action) => {
  // if (action.type === 'CLIENT_UNSET') {
  //   const { routing } = state
  //   state = { routing } 
  // }
  return appReducer(state, action)
}

export default IndexReducer