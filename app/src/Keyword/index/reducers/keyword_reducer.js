import {
  RECEIVE_ALL_KEYWORDS,
  RECEIVE_KEYWORD,
  REMOVE_KEYWORD,
  RECEIVE_WEBSITES,
  RECEIVE_TAGS_UPDATE,
  RECEIVE_DETAIL_VIEW
} from '../actions/keywords_actions'
import merge from 'lodash/merge'
import actionCreators from '../../../Users/actions';

const initialState = {
  websites: [],
  keywords: [],
  analysisId: ''
}

export default function keywordReducer(state = initialState, action){

  Object.freeze(state)
  let newState = merge({}, state)
  switch (action.type) {
    case RECEIVE_WEBSITES:
      newState.websites = action.payload;
      return newState;
    case RECEIVE_DETAIL_VIEW:
      newState.analysisId = action.payload;
      return newState;
    case RECEIVE_ALL_KEYWORDS:
      newState.keywords = action.keywords;
      newState.analysisId = '';
      return newState;
    case RECEIVE_KEYWORD:
      var keywords = newState.keywords;
      if (Array.isArray(action.keyword)) {
        for (let k of action.keyword) {
          keywords[k._id] = k;
        }
      } else {
        keywords[action.keyword._id] = action.keyword;
      }
      return newState;
      //return merge({},state,{[action.keyword._id]:action.keyword})
    case REMOVE_KEYWORD:
      if (action.ids) {
        action
          .ids
          .split(',')
          .map(x => {
            delete newState.keywords[x]
          })
        return newState;
      }
      return state;
    case RECEIVE_TAGS_UPDATE:
      {
        const {ids, tags} = action.payload;
        if (ids.length > 0) {
          ids.map(x => {
            newState[x].tags = tags
          })
          return newState;
        }
        return state;
      }
    default:
      return state;
  }
}

