import {RECEIVE_ALL_KEYWORDS, RECEIVE_KEYWORD, REMOVE_KEYWORD, RECEIVE_WEBSITES,RECEIVE_TAGS_UPDATE} from '../actions/keywords_actions'
import merge from 'lodash/merge'
import actionCreators from '../../../Users/actions';

export const keywordReducer = (state = [], action) => {

  Object.freeze(state)
  let newState = merge({}, state)
  switch (action.type) {
    case RECEIVE_ALL_KEYWORDS:
      return action.keywords;
    case RECEIVE_KEYWORD:
      if (Array.isArray(action.keyword)) {
        for (let k of action.keyword) {
          newState[k._id] = k;
        }
      } else {
        newState[action.keyword._id] = action.keyword;
      }
      return newState;
      //return merge({},state,{[action.keyword._id]:action.keyword})
    case REMOVE_KEYWORD:
      if (action.ids) {
        action
          .ids
          .split(',')
          .map(x => {
            delete newState[x]
          })
        return newState;
      }
      return state;
    case RECEIVE_TAGS_UPDATE:
      {
        const {ids,tags} = action.payload;
        if (ids.length > 0) {
            ids
            .map(x => {
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

export const websiteReducer = (state = [], action) => {
  Object.freeze(state);
  let newState = merge({}, state);
  switch (action.type) {
    case RECEIVE_WEBSITES:
      return action.payload;
    default:
      return state;
  }
}