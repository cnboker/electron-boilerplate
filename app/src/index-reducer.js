import { combineReducers } from 'redux'
import { reducer as form } from 'redux-form'
import signup from './Signup/reducer'
import client from './Client/reducer'
import login from './Login/reducer'
import keywordReducer from './Keyword/reducer'
import eventReducer from './Event/reducer'
import userReducer from './Users/reducer'
import { loadingBarReducer } from 'react-redux-loading-bar'
import snReducer from './SN/reducer'
import questionReducer from './Quora/reducers/question_reducer'
import topicReducer from './Quora/reducers/topics_reducer'
const appReducer = combineReducers({
  /* your app’s top-level reducers */
  form,
  signup,
  client,
  login,
  keywords: keywordReducer,
  loadingBar: loadingBarReducer,
  users:userReducer,
  events: eventReducer,
  sn:snReducer,
  questions:questionReducer,
  topic:topicReducer
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